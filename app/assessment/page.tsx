'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SECTIONS, getScaleBatches, type Question } from '@/lib/questions'
import { User, Brain, Heart, Users, Zap, Sparkles, Shield, MessageSquare, ChevronLeft } from 'lucide-react'

type ResponseValue = string | number | string[] | null

interface ResponseMap {
  [questionId: string]: ResponseValue
}

const SECTION_ICONS = [User, Brain, Heart, Users, Zap, Sparkles, Shield, MessageSquare]

const SECTION_DESCRIPTIONS = [
  'Who you are at your core and how you naturally show up',
  'How your mind processes information and makes decisions',
  'What you feel most deeply and what drives you emotionally',
  'How you relate to and connect with other people',
  'Your natural energy, drive, and work patterns',
  'Your creative tendencies and how you generate ideas',
  'Your values, boundaries, and what you protect',
  'Your history, dreams, and the path you\'ve walked',
]

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

type Step = { type: 'single', question: Question } | { type: 'scaleBatch', questions: Question[] }

function buildStepsForSection(sectionIndex: number): Step[] {
  const sec = SECTIONS[sectionIndex]
  if (sectionIndex === 7) {
    return sec.questions.map(q => ({ type: 'single' as const, question: q }))
  }
  const steps: Step[] = []
  for (const q of sec.questions) {
    if (q.type !== 'scale') {
      steps.push({ type: 'single', question: q })
    }
  }
  const scaleQs = sec.questions.filter(q => q.type === 'scale')
  if (scaleQs.length > 0) {
    const batches = getScaleBatches(scaleQs)
    for (const batch of batches) {
      steps.push({ type: 'scaleBatch', questions: batch })
    }
  }
  return steps
}

export default function AssessmentPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('there')
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<ResponseMap>({})
  const [showSectionComplete, setShowSectionComplete] = useState(false)
  const [showSectionIntro, setShowSectionIntro] = useState(false)
  const [showWelcomeIntro, setShowWelcomeIntro] = useState(true)
  const [scaleBatchIndex, setScaleBatchIndex] = useState(0)
  const [textValue, setTextValue] = useState('')
  const [otherInputValue, setOtherInputValue] = useState('')
  const [saveError, setSaveError] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const uid = localStorage.getItem('mt_user_id')
    const fn = localStorage.getItem('mt_first_name')
    if (!uid) { router.push('/start'); return }
    setUserId(uid)
    if (fn) setFirstName(fn)

    // Restore saved progress
    try {
      const saved = localStorage.getItem('mt_assessment_progress')
      if (saved) {
        const { responses: savedResponses, section, questionIndex } = JSON.parse(saved)
        if (savedResponses && typeof savedResponses === 'object') {
          setResponses(savedResponses)
          setCurrentSection(section ?? 0)
          setCurrentQuestionIndex(questionIndex ?? 0)
          if (section > 0 || questionIndex > 0) setShowWelcomeIntro(false)
        }
      }
    } catch { /* ignore corrupt data */ }
  }, [router])

  // Save progress to localStorage
  useEffect(() => {
    if (!userId) return
    try {
      localStorage.setItem('mt_assessment_progress', JSON.stringify({
        responses,
        section: currentSection,
        questionIndex: currentQuestionIndex,
      }))
    } catch { /* storage full or unavailable */ }
  }, [responses, currentSection, currentQuestionIndex, userId])

  // Intercept browser back button — keep a history entry pushed so that
  // pressing back triggers goBack() (previous question) instead of leaving the page
  const goBackRef = useRef<() => void>(() => {})
  useEffect(() => {
    goBackRef.current = goBack
  })
  useEffect(() => {
    // Push an initial entry so there is always something to pop back to
    window.history.pushState({ assessment: true }, '')
    const handlePopState = () => {
      goBackRef.current()
      // Re-push so the next browser back press is also intercepted
      window.history.pushState({ assessment: true }, '')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const saveResponse = useCallback(
    debounce(async (uid: string, section: number, questionId: string, type: string, value: ResponseValue) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) return
      try {
        const res = await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid, section, questionId, responseType: type, responseValue: value })
        })
        if (!res.ok) throw new Error('Save failed')
        setSaveError(false)
      } catch {
        setSaveError(true)
      }
    }, 800),
    []
  )

  const section = SECTIONS[currentSection]
  const steps = buildStepsForSection(currentSection)
  const currentStep = steps[currentQuestionIndex]

  // Overall progress
  const totalSteps = SECTIONS.reduce((acc, _, i) => acc + buildStepsForSection(i).length, 0)
  const completedSteps = SECTIONS.slice(0, currentSection).reduce((acc, _, i) => acc + buildStepsForSection(i).length, 0) + currentQuestionIndex
  const progressPct = Math.round((completedSteps / totalSteps) * 100)
  const minutesLeft = Math.max(1, Math.round(((totalSteps - completedSteps) / totalSteps) * 20))

  function handleResponse(questionId: string, type: string, value: ResponseValue, sectionNum: number) {
    setResponses(prev => ({ ...prev, [questionId]: value }))
    if (userId) saveResponse(userId, sectionNum, questionId, type, value)
  }

  function advanceStep() {
    window.scrollTo(0, 0)
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= steps.length) {
      setShowSectionComplete(true)
    } else {
      setCurrentQuestionIndex(nextIndex)
      setTextValue('')
      setOtherInputValue('')
    }
  }

  function goBack() {
    if (showSectionComplete) {
      setShowSectionComplete(false)
      return
    }
    if (showSectionIntro) {
      setShowSectionIntro(false)
      setShowSectionComplete(true)
      return
    }
    if (currentQuestionIndex > 0) {
      const prevStep = steps[currentQuestionIndex - 1]
      const prevText = prevStep?.type === 'single' && prevStep.question.type === 'text'
        ? (responses[prevStep.question.id] as string ?? '')
        : ''
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setTextValue(prevText)
      setOtherInputValue('')
    } else if (currentSection > 0) {
      const prevSteps = buildStepsForSection(currentSection - 1)
      const prevStep = prevSteps[prevSteps.length - 1]
      const prevText = prevStep?.type === 'single' && prevStep.question.type === 'text'
        ? (responses[prevStep.question.id] as string ?? '')
        : ''
      setCurrentSection(currentSection - 1)
      setCurrentQuestionIndex(prevSteps.length - 1)
      setScaleBatchIndex(0)
      setTextValue(prevText)
      setOtherInputValue('')
    }
  }

  function handleSectionContinue() {
    setShowSectionComplete(false)
    window.scrollTo(0, 0)
    if (currentSection < SECTIONS.length - 1) {
      const nextSection = currentSection + 1
      setCurrentSection(nextSection)
      setCurrentQuestionIndex(0)
      setScaleBatchIndex(0)
      setTextValue('')
      setOtherInputValue('')
      // Show brief section intro for sections 2+
      setShowSectionIntro(true)
      setTimeout(() => setShowSectionIntro(false), 1800)
    } else {
      localStorage.removeItem('mt_assessment_progress')
      router.push('/generating')
    }
  }

  const canGoBack = currentSection > 0 || currentQuestionIndex > 0 || showSectionComplete

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (showWelcomeIntro) {
        if (e.key === 'Enter') setShowWelcomeIntro(false)
        return
      }
      if (showSectionComplete) {
        if (e.key === 'Enter') handleSectionContinue()
        return
      }
      if (!currentStep) return

      if (currentStep.type === 'scaleBatch') {
        const key = parseInt(e.key)
        if (key >= 1 && key <= 5) {
          const unanswered = currentStep.questions.find(q => !responses[q.id])
          if (unanswered) {
            handleResponse(unanswered.id, 'scale', key, unanswered.section)
          }
        }
      }

      if (e.key === 'Enter' && currentStep.type === 'single') {
        const q = currentStep.question
        if (q.type === 'text' || q.type === 'slider' || q.type === 'number') {
          const val = q.type === 'text' ? textValue : responses[q.id]
          if (val !== null && val !== undefined) {
            if (q.type === 'text') {
              e.preventDefault() // prevent newline being inserted into textarea
              handleResponse(q.id, 'text', textValue, q.section)
            }
            advanceStep()
          }
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentStep, responses, showSectionComplete, showWelcomeIntro, textValue]) // eslint-disable-line

  if (!userId) return null

  // Welcome intro screen
  if (showWelcomeIntro) {
    return <WelcomeIntroScreen firstName={firstName} onStart={() => setShowWelcomeIntro(false)} />
  }

  // Brief section intro (auto-dismiss)
  if (showSectionIntro) {
    return <SectionIntroScreen section={SECTIONS[currentSection]} sectionIndex={currentSection} />
  }

  if (showSectionComplete) {
    return (
      <SectionCompleteScreen
        section={section}
        sectionIndex={currentSection}
        progress={currentSection === SECTIONS.length - 1 ? 100 : Math.round(((currentSection + 1) / SECTIONS.length) * 100)}
        onContinue={handleSectionContinue}
        onBack={goBack}
        isLast={currentSection === SECTIONS.length - 1}
      />
    )
  }

  const currentQuestion = currentStep?.type === 'single' ? currentStep.question : null

  return (
    <div style={{ backgroundColor: 'var(--brand-bg-subtle)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'color-mix(in srgb, var(--brand-card) 97%, transparent)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--brand-border)', padding: '0.75rem 1rem'
      }}>
        {/* Row: back + section icons + time + % */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          {/* Back button */}
          <button
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="Go back"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: canGoBack ? 'rgba(37,99,235,0.08)' : 'transparent',
              border: `1px solid ${canGoBack ? 'rgba(37,99,235,0.25)' : 'transparent'}`,
              cursor: canGoBack ? 'pointer' : 'default',
              opacity: canGoBack ? 1 : 0,
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={15} color="#2563eb" />
          </button>

          {/* Section icons — centered */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {SECTIONS.map((s, i) => {
              const Icon = SECTION_ICONS[i]
              const isComplete = i < currentSection
              const isCurrent = i === currentSection
              return (
                <div key={i} title={s.title} style={{
                  width: '26px', height: '26px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isComplete ? 'rgba(37,99,235,0.12)' : isCurrent ? 'rgba(37,99,235,0.08)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${isComplete ? 'rgba(37,99,235,0.4)' : isCurrent ? 'rgba(37,99,235,0.3)' : 'var(--brand-border)'}`,
                  transition: 'all 0.3s'
                }}>
                  <Icon size={11} color={isComplete ? '#2563eb' : isCurrent ? '#1d4ed8' : '#94a3b8'} />
                </div>
              )
            })}
          </div>

          {/* Progress % + time */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '1px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>
              {progressPct}%
            </span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              ~{minutesLeft}m left
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'var(--brand-border)', borderRadius: '2px' }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            width: `${progressPct}%`,
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Section 3+ social proof */}
        {currentSection >= 2 && (
          <p style={{ fontSize: '0.7rem', color: '#06b6d4', marginTop: '5px', textAlign: 'center', opacity: 0.7 }}>
            94% of people who reach this point complete the full assessment
          </p>
        )}
      </header>

      {/* Save error toast */}
      {saveError && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          background: '#ef4444', color: '#fff', padding: '0.75rem 1.25rem',
          borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(239,68,68,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
        }}>
          <span>⚠️</span> Connection issue — check your internet and try again
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem 1rem 5rem', maxWidth: '540px', margin: '0 auto', width: '100%' }}>
        {/* Section label */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{
            fontSize: '0.75rem', color: '#06b6d4', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '6px', fontWeight: 600
          }}>
            Section {currentSection + 1} of 8 · {section.title}
          </p>
          {currentStep?.type === 'scaleBatch' && (
            <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.5 }}>
              {section.description}
            </p>
          )}
        </div>

        {/* Question content */}
        {currentStep && (
          <div className="animate-fade-in" key={`step-${currentSection}-${currentQuestionIndex}`}>
            {currentStep.type === 'single' ? (
              <SingleQuestion
                question={currentStep.question}
                value={currentQuestion?.type === 'text' ? textValue : (responses[currentQuestion!.id] ?? null)}
                responses={responses}
                otherInputValue={otherInputValue}
                onOtherInputChange={setOtherInputValue}
                onTextChange={setTextValue}
                onChange={(val) => {
                  handleResponse(currentStep.question.id, currentStep.question.type, val, currentStep.question.section)
                  // Auto-advance only for single-select (not Other, not multiselect)
                  if (currentStep.question.type === 'select' && val !== 'Other') {
                    setTimeout(advanceStep, 280)
                  }
                }}
                onContinue={() => {
                  const q = currentStep.question
                  if (q.type === 'text') {
                    handleResponse(q.id, 'text', textValue, q.section)
                  } else if (q.type === 'select' && responses[q.id] === 'Other' && otherInputValue.trim()) {
                    handleResponse(q.id, 'text', `Other: ${otherInputValue.trim()}`, q.section)
                  }
                  advanceStep()
                }}
                firstName={firstName}
                isSection8={currentSection === 7}
              />
            ) : (
              <ScaleBatch
                questions={currentStep.questions}
                responses={responses}
                onChange={(qId, val, sectionNum) => handleResponse(qId, 'scale', val, sectionNum)}
                onComplete={advanceStep}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// ===== WELCOME INTRO SCREEN =====
function WelcomeIntroScreen({ firstName, onStart }: { firstName: string, onStart: () => void }) {
  return (
    <div style={{
      backgroundColor: 'var(--brand-bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.35
      }} />
      <div className="animate-pulse-glow" style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 65%)',
        filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div className="animate-fade-in" style={{ position: 'relative', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem',
          fontSize: '0.72rem', color: '#2563eb', letterSpacing: '0.07em',
          textTransform: 'uppercase', fontWeight: 700
        }}>
          Here&apos;s what&apos;s coming
        </div>

        <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--brand-text)', marginBottom: '0.75rem' }}>
          Hi {firstName !== 'there' ? firstName : 'there'}. Ready to find out{' '}
          <span className="gradient-text">what you&apos;re built for?</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--brand-text-mid)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          75 questions · ~25 minutes · Answer honestly — there are no right answers
        </p>

        {/* Section list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          {SECTIONS.map((s, i) => {
            const Icon = SECTION_ICONS[i]
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--brand-bg-subtle)', borderRadius: '10px', padding: '0.625rem 0.875rem',
                border: '1px solid var(--brand-border)'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={11} color="#2563eb" />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-text-muted)', fontWeight: 500 }}>{s.title}</span>
              </div>
            )
          })}
        </div>

        <button
          onClick={onStart}
          className="gradient-btn"
          style={{
            width: '100%', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
            padding: '1rem', borderRadius: '14px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(37,99,235,0.28)', fontFamily: 'inherit'
          }}
        >
          Let&apos;s go →
        </button>
      </div>
    </div>
  )
}

// ===== SECTION INTRO SCREEN (auto-dismiss) =====
function SectionIntroScreen({ section, sectionIndex }: { section: typeof SECTIONS[0], sectionIndex: number }) {
  const Icon = SECTION_ICONS[sectionIndex]
  return (
    <div style={{
      backgroundColor: 'var(--brand-bg-subtle)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '380px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 1.5rem',
          background: 'rgba(37,99,235,0.08)', border: '2px solid rgba(37,99,235,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={22} color="#2563eb" />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem', fontWeight: 600 }}>
          Section {sectionIndex + 1} of 8
        </p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          {section.title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--brand-text-mid)', lineHeight: 1.65 }}>
          {SECTION_DESCRIPTIONS[sectionIndex]}
        </p>
      </div>
    </div>
  )
}

// ===== SINGLE QUESTION =====
function SingleQuestion({
  question, value, responses, otherInputValue, onOtherInputChange, onTextChange, onChange, onContinue, firstName, isSection8
}: {
  question: Question
  value: ResponseValue
  responses: ResponseMap
  otherInputValue: string
  onOtherInputChange: (val: string) => void
  onTextChange: (val: string) => void
  onChange: (val: ResponseValue) => void
  onContinue: () => void
  firstName: string
  isSection8: boolean
}) {
  const textVal = typeof value === 'string' ? value : ''
  const numVal = typeof value === 'number' ? value : (question.min ?? 0)
  const arrVal = Array.isArray(value) ? value : []

  let options = question.options ?? []
  if (question.id === 'q66') {
    const q65Val = responses['q65']
    options = Array.isArray(q65Val) && q65Val.length > 0 ? q65Val : (question.options ?? [])
  }

  const isOtherSelected = question.type === 'select' && value === 'Other'

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'var(--brand-card)', border: '1px solid var(--brand-border)',
    borderRadius: '12px', color: 'var(--brand-text)', fontSize: '0.95rem', outline: 'none',
    lineHeight: 1.6, fontFamily: 'inherit'
  }

  const continueBtn: React.CSSProperties = {
    width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none',
    cursor: 'pointer', fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.875rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    transition: 'all 0.2s ease', fontFamily: 'inherit'
  }

  return (
    <div>
      <h2 style={{
        fontSize: isSection8 ? 'clamp(1.25rem, 3.5vw, 1.55rem)' : 'clamp(1.15rem, 3vw, 1.4rem)',
        fontWeight: 700, lineHeight: 1.4, marginBottom: '1.75rem', color: 'var(--brand-text)'
      }}>
        {question.label}
        {question.optional && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>
            Optional
          </span>
        )}
      </h2>

      {question.type === 'number' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={e => onChange(parseInt(e.target.value) || null)}
            min={13} max={30}
            placeholder="Enter your age"
            style={{ ...inputBase, textAlign: 'center' }}
          />
          <button
            onClick={onContinue}
            disabled={!value}
            style={{ ...continueBtn, opacity: value ? 1 : 0.4, cursor: value ? 'pointer' : 'not-allowed' }}
          >
            Continue →
          </button>
        </div>
      )}

      {question.type === 'text' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              value={textVal}
              onChange={e => onTextChange(e.target.value)}
              placeholder={question.placeholder || 'Type your answer here...'}
              rows={isSection8 ? 6 : 4}
              style={{ ...inputBase, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
              autoFocus={isSection8}
              onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
            />
            <span style={{
              position: 'absolute', bottom: '8px', right: '12px',
              fontSize: '0.7rem', color: '#94a3b8'
            }}>
              {textVal.length}
            </span>
          </div>
          {isSection8 && (
            <p style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '8px' }}>
              💡 Tip: On mobile, tap the microphone on your keyboard for voice-to-text.
            </p>
          )}
          <button onClick={onContinue} style={continueBtn}>
            Continue →
          </button>
        </div>
      )}

      {question.type === 'select' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                width: '100%', padding: '13px 16px', textAlign: 'left',
                background: value === opt ? 'rgba(37,99,235,0.07)' : 'var(--brand-card)',
                border: `1px solid ${value === opt ? '#3b82f6' : 'var(--brand-border)'}`,
                borderRadius: '12px', color: 'var(--brand-text)', fontSize: '0.9rem', cursor: 'pointer',
                lineHeight: 1.4, transition: 'all 0.15s ease', fontFamily: 'inherit',
                fontWeight: value === opt ? 600 : 400
              }}
            >
              {opt}
            </button>
          ))}
          {/* Text input when "Other" is selected */}
          {isOtherSelected && (
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                value={otherInputValue}
                onChange={e => onOtherInputChange(e.target.value)}
                placeholder="Please explain..."
                autoFocus
                style={inputBase}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--brand-border)'}
              />
              <button onClick={onContinue} style={continueBtn}>
                Continue →
              </button>
            </div>
          )}
        </div>
      )}

      {question.type === 'multiselect' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(question.options ?? []).map(opt => (
              <button
                key={opt}
                onClick={() => {
                  const next = arrVal.includes(opt)
                    ? arrVal.filter(v => v !== opt)
                    : [...arrVal, opt]
                  onChange(next)
                }}
                style={{
                  padding: '9px 16px',
                  background: arrVal.includes(opt) ? 'rgba(37,99,235,0.08)' : 'var(--brand-card)',
                  border: `1px solid ${arrVal.includes(opt) ? '#3b82f6' : 'var(--brand-border)'}`,
                  borderRadius: '100px', color: arrVal.includes(opt) ? '#2563eb' : 'var(--brand-text)',
                  fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: 'inherit', fontWeight: arrVal.includes(opt) ? 600 : 400
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {arrVal.length > 0 ? (
            <button onClick={onContinue} style={continueBtn}>
              Continue ({arrVal.length} selected) →
            </button>
          ) : question.optional ? (
            <button onClick={onContinue} style={{ ...continueBtn, background: 'var(--brand-card)', color: 'var(--brand-text-mid)', border: '1px solid var(--brand-border)' }}>
              Skip →
            </button>
          ) : null}
        </div>
      )}

      {question.type === 'slider' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '2.5rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {numVal}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--brand-text-mid)', marginLeft: '4px' }}>
              {numVal === question.max ? question.maxLabel : numVal === question.min ? question.minLabel : ''}
            </span>
          </div>
          <input
            type="range"
            min={question.min ?? 0}
            max={question.max ?? 10}
            step={question.step ?? 1}
            value={numVal}
            onChange={e => onChange(parseInt(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{question.minLabel}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{question.maxLabel}</span>
          </div>
          <button onClick={onContinue} style={{ ...continueBtn, marginTop: '1.5rem' }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

// ===== SCALE BATCH =====
function ScaleBatch({
  questions, responses, onChange, onComplete
}: {
  questions: Question[]
  responses: ResponseMap
  onChange: (qId: string, val: number, sectionNum: number) => void
  onComplete: () => void
}) {
  const allAnswered = questions.every(q => responses[q.id] !== undefined && responses[q.id] !== null)
  const hasInteractedRef = useRef(false)
  const isAgreementScale = questions[0]?.section === 3 || questions[0]?.section === 4
  const scaleLabels = isAgreementScale
    ? ['Strongly disagree', 'Neutral', 'Strongly agree']
    : ['Not me', 'Somewhat me', 'Exactly me']

  useEffect(() => {
    // Only auto-advance after the user actually clicks something in this batch —
    // prevents immediately skipping forward when navigating back to an already-answered batch
    if (allAnswered && hasInteractedRef.current) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
  }, [allAnswered, onComplete])

  const answeredCount = questions.filter(q => responses[q.id] !== undefined && responses[q.id] !== null).length
  const someAnswered = answeredCount > 0 && !allAnswered

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {questions.map(q => {
          const val = responses[q.id] as number | undefined
          const unanswered = someAnswered && !val
          return (
            <div key={q.id} style={{
              background: val ? 'var(--brand-card)' : unanswered ? 'rgba(37,99,235,0.03)' : 'var(--brand-card)',
              borderRadius: '14px', padding: '1rem',
              border: `1px solid ${val ? 'rgba(37,99,235,0.3)' : unanswered ? 'rgba(37,99,235,0.35)' : 'var(--brand-border)'}`,
              boxShadow: val ? '0 1px 3px rgba(0,0,0,0.04)' : unanswered ? '0 0 0 1px rgba(37,99,235,0.15), 0 2px 8px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}>
              <p style={{
                fontSize: '0.875rem', color: 'var(--brand-text)',
                lineHeight: 1.55, marginBottom: '0.75rem', fontWeight: 500,
                display: 'flex', alignItems: 'flex-start', gap: '6px'
              }}>
                <span style={{ flex: 1 }}>{q.label}</span>
                {val ? (
                  <span style={{ color: '#06b6d4', fontSize: '0.75rem', flexShrink: 0, marginTop: '1px' }}>✓</span>
                ) : unanswered ? (
                  <span style={{ color: '#3b82f6', fontSize: '0.65rem', fontWeight: 600, flexShrink: 0, marginTop: '2px', letterSpacing: '0.02em' }}>answer ↑</span>
                ) : null}
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => { hasInteractedRef.current = true; onChange(q.id, n, q.section) }}
                    style={{
                      flex: 1, padding: '9px 0',
                      background: val === n ? 'rgba(37,99,235,0.1)' : 'var(--brand-bg-subtle)',
                      border: `1px solid ${val === n ? '#3b82f6' : 'var(--brand-border)'}`,
                      borderRadius: '8px', color: val === n ? '#2563eb' : 'var(--brand-text-mid)',
                      fontSize: '0.9rem', fontWeight: val === n ? 700 : 400, cursor: 'pointer',
                      transition: 'all 0.15s ease', fontFamily: 'inherit'
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{scaleLabels[0]}</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>{scaleLabels[1]}</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{scaleLabels[2]}</span>
              </div>
            </div>
          )
        })}
      </div>

      {allAnswered && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '0.875rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }} />
            Moving on...
          </div>
        </div>
      )}
    </div>
  )
}

// ===== SECTION COMPLETE =====
function SectionCompleteScreen({
  section, sectionIndex, progress, onContinue, onBack, isLast
}: {
  section: typeof SECTIONS[0]
  sectionIndex: number
  progress: number
  onContinue: () => void
  onBack: () => void
  isLast: boolean
}) {
  const isHalfway = sectionIndex === 3 // section 4 complete (0-indexed)

  return (
    <div style={{
      backgroundColor: 'var(--brand-bg-subtle)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: '100px', padding: '6px 14px', cursor: 'pointer',
          color: '#2563eb', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit'
        }}
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Subtle glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-pulse-glow" style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)'
        }} />
      </div>

      <div className="animate-fade-in" style={{
        position: 'relative', textAlign: 'center', maxWidth: '480px', width: '100%'
      }}>
        {/* Progress ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="url(#completeGrad)" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 251.3} 251.3`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="completeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-text)' }}>{progress}%</span>
          </div>
        </div>

        {isLast ? (
          <>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <span className="gradient-text">You&apos;re done. ✓</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--brand-text-mid)', lineHeight: 1.65, marginBottom: '2rem' }}>
              {section.encouragement}
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.75rem', color: 'var(--brand-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Section complete
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--brand-text)' }}>
              {section.title} ✓
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--brand-text-mid)', lineHeight: 1.65, marginBottom: '2rem' }}>
              {isHalfway
                ? "You're halfway through. The people who finish are the ones who actually get answers. Keep going."
                : section.encouragement}
            </p>
          </>
        )}

        <button
          onClick={onContinue}
          style={{
            fontSize: '1.05rem', fontWeight: 700, color: '#ffffff',
            padding: '0.9rem 2.5rem', borderRadius: '100px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            transition: 'all 0.2s ease', fontFamily: 'inherit'
          }}
        >
          {isLast ? 'See my results →' : 'Continue →'}
        </button>

      </div>
    </div>
  )
}
