export type QuestionType = 'number' | 'text' | 'select' | 'multiselect' | 'scale' | 'slider' | 'scale-batch'

export interface Question {
  id: string
  section: number
  type: QuestionType
  label: string
  placeholder?: string
  optional?: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  minLabel?: string
  maxLabel?: string
  batchGroup?: string // groups scale questions together
}

export interface Section {
  id: number
  title: string
  icon: string
  description: string
  encouragement: string
  questions: Question[]
}

export const SECTIONS: Section[] = [
  {
    id: 1,
    title: 'The Basics',
    icon: 'User',
    description: 'Let\'s start with where you\'re at right now.',
    encouragement: 'Great start. You\'ve told us where you\'re standing — now let\'s go deeper.',
    questions: [
      { id: 'q1', section: 1, type: 'number', label: 'How old are you?' },
      { id: 'q2', section: 1, type: 'text', label: 'Where are you based?', placeholder: 'City, Country' },
      {
        id: 'q3', section: 1, type: 'select', label: 'What\'s your current situation?',
        options: ['In high school', 'At university', 'Dropped out or taking a break', 'Working a job', 'Running my own business', 'Not working, not studying', 'Doing a bit of everything', 'Other']
      },
      { id: 'q4', section: 1, type: 'text', label: 'If studying — what are you studying?', optional: true, placeholder: 'e.g. Business, Psychology, Engineering...' },
      {
        id: 'q5', section: 1, type: 'select', label: 'Who do you live with?',
        options: ['Parents/family', 'On my own', 'With a partner', 'With roommates/friends', 'Other']
      },
      {
        id: 'q6', section: 1, type: 'select', label: 'How would you describe your financial situation?',
        options: [
          'Comfortable — I have savings and no major pressure',
          'Getting by — I cover basics but not much spare',
          'Tight — money stresses me out regularly',
          'Supported by parents but want independence'
        ]
      },
      { id: 'q7', section: 1, type: 'slider', label: 'How many hours per week do you have available to work on something new?', min: 0, max: 40, step: 2, minLabel: '0 hrs', maxLabel: '40+ hrs' },
      { id: 'q8', section: 1, type: 'slider', label: 'How fulfilled do you feel with your life right now?', min: 1, max: 10, step: 1, minLabel: 'Not at all', maxLabel: 'Completely' }
    ]
  },
  {
    id: 2,
    title: 'Your Wiring',
    icon: 'Brain',
    description: 'Rate how much each statement describes you. 1 = Not me at all, 5 = That\'s exactly me.',
    encouragement: 'Nice — you\'re starting to see your patterns. Keep going.',
    questions: [
      { id: 'q9', section: 2, type: 'scale', label: 'I get energised by being around people and having conversations.' },
      { id: 'q10', section: 2, type: 'scale', label: 'I need time alone to recharge after being social.' },
      { id: 'q11', section: 2, type: 'scale', label: 'I\'m naturally curious — I love exploring new ideas, topics, and perspectives.' },
      { id: 'q12', section: 2, type: 'scale', label: 'I\'d rather try something and figure it out on the fly than plan it perfectly first.' },
      { id: 'q13', section: 2, type: 'scale', label: 'I tend to start things with a lot of energy but struggle to finish them.' },
      { id: 'q14', section: 2, type: 'scale', label: 'I follow through on commitments even when they get boring.' },
      { id: 'q15', section: 2, type: 'scale', label: 'I feel things deeply — emotions hit me harder than most people I know.' },
      { id: 'q16', section: 2, type: 'scale', label: 'I bounce back from setbacks pretty quickly.' },
      { id: 'q17', section: 2, type: 'scale', label: 'I care a lot about what other people think of me.' },
      { id: 'q18', section: 2, type: 'scale', label: 'I trust my gut over logic when making decisions.' },
      { id: 'q19', section: 2, type: 'scale', label: 'I\'m more of a creative thinker than a structured planner.' },
      { id: 'q20', section: 2, type: 'scale', label: 'I naturally notice things other people miss — patterns, moods, details.' },
      { id: 'q21', section: 2, type: 'scale', label: 'I\'m competitive. I want to win.' },
      { id: 'q22', section: 2, type: 'scale', label: 'I\'d rather do meaningful work for less money than boring work for more.' },
      { id: 'q23', section: 2, type: 'scale', label: 'I feel restless most of the time, like I should be doing more.' }
    ]
  },
  {
    id: 3,
    title: 'Your Inner World',
    icon: 'Heart',
    description: '1 = Strongly disagree, 5 = Strongly agree. Be honest — this is the most important section.',
    encouragement: '94% of people who reach this point complete the full assessment. You\'re almost halfway.',
    questions: [
      { id: 'q24', section: 3, type: 'scale', label: 'I often feel like I\'m behind compared to people my age.' },
      { id: 'q25', section: 3, type: 'scale', label: 'I have a harsh inner critic that\'s hard to shut off.' },
      { id: 'q26', section: 3, type: 'scale', label: 'I overthink decisions to the point where I don\'t make them.' },
      { id: 'q27', section: 3, type: 'scale', label: 'I\'ve experienced periods of low mood or motivation that lasted weeks or longer.' },
      { id: 'q28', section: 3, type: 'scale', label: 'I feel anxious about the future more often than I feel excited about it.' },
      { id: 'q29', section: 3, type: 'scale', label: 'I\'m harder on myself than I am on other people.' },
      { id: 'q30', section: 3, type: 'scale', label: 'I struggle with consistency — I know what I should do but I don\'t do it.' },
      { id: 'q31', section: 3, type: 'scale', label: 'I feel misunderstood by most people in my life.' },
      { id: 'q32', section: 3, type: 'scale', label: 'I\'ve been told I\'m "too sensitive" or "too intense."' },
      { id: 'q33', section: 3, type: 'scale', label: 'I tend to avoid things that scare me rather than face them.' },
      { id: 'q34', section: 3, type: 'scale', label: 'When something goes wrong, my first instinct is to blame myself.' },
      { id: 'q35', section: 3, type: 'scale', label: 'I feel like I have more potential than I\'m currently using.' },
      { id: 'q36', section: 3, type: 'scale', label: 'I compare myself to others on social media and feel worse afterward.' },
      { id: 'q37', section: 3, type: 'scale', label: 'I have trouble asking for help, even when I need it.' },
      { id: 'q38', section: 3, type: 'scale', label: 'I feel pressure to have my life figured out by now.' }
    ]
  },
  {
    id: 4,
    title: 'Relationships & Roots',
    icon: 'Users',
    description: 'Where you came from shapes where you\'re going. 1 = Strongly disagree, 5 = Strongly agree.',
    encouragement: 'That was the emotional core. You\'re over halfway — the finish line is close.',
    questions: [
      { id: 'q39', section: 4, type: 'scale', label: 'My parents are supportive of me doing something non-traditional.' },
      { id: 'q40', section: 4, type: 'scale', label: 'I feel pressure from my family to follow a specific path.' },
      { id: 'q41', section: 4, type: 'scale', label: 'Growing up, I felt truly seen and understood by at least one parent.' },
      { id: 'q42', section: 4, type: 'scale', label: 'My family values stability and security over passion and freedom.' },
      { id: 'q43', section: 4, type: 'scale', label: 'I have at least one person in my life who believes in what I\'m trying to do.' },
      { id: 'q44', section: 4, type: 'scale', label: 'I tend to seek approval from others before trusting my own judgment.' },
      { id: 'q45', section: 4, type: 'scale', label: 'I feel comfortable being vulnerable with the people closest to me.' },
      { id: 'q46', section: 4, type: 'scale', label: 'I\'ve had a relationship (romantic or friendship) that significantly changed how I see myself.' },
      { id: 'q47', section: 4, type: 'scale', label: 'I feel lonely, even when I\'m around people.' },
      { id: 'q48', section: 4, type: 'scale', label: 'There\'s someone in my life whose career or lifestyle I watched and thought "I don\'t want that for myself."' },
      { id: 'q49', section: 4, type: 'scale', label: 'I have friends or peers who are building something of their own.' },
      { id: 'q50', section: 4, type: 'scale', label: 'When I was younger, I felt "different" from the other kids.' },
      { id: 'q51', section: 4, type: 'scale', label: 'I experienced something in my childhood or teenage years that significantly shaped who I am today.' },
      {
        id: 'q52', section: 4, type: 'select', label: 'How would you describe the overall influence your upbringing has had on your ambitions?',
        options: [
          'It gave me confidence to go after what I want',
          'It made me cautious — I was taught to play it safe',
          'It\'s complicated — mixed messages',
          'It lit a fire in me to prove something',
          'I\'m still figuring out the impact'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Energy & Patterns',
    icon: 'Zap',
    description: '1 = Not me at all, 5 = That\'s exactly me.',
    encouragement: 'You\'re almost there. Two sections left — these go fast.',
    questions: [
      { id: 'q53', section: 5, type: 'scale', label: 'I work best in short, intense bursts rather than long steady sessions.' },
      { id: 'q54', section: 5, type: 'scale', label: 'I need external deadlines to get things done — I can\'t rely on self-imposed ones.' },
      { id: 'q55', section: 5, type: 'scale', label: 'I do my best thinking late at night.' },
      { id: 'q56', section: 5, type: 'scale', label: 'I need variety in my day or I lose motivation.' },
      { id: 'q57', section: 5, type: 'scale', label: 'I can hyperfocus on something I care about for hours and lose track of time.' },
      { id: 'q58', section: 5, type: 'scale', label: 'I procrastinate on things that feel boring, even when they\'re important.' },
      { id: 'q59', section: 5, type: 'scale', label: 'I feel most alive when I\'m creating something.' },
      { id: 'q60', section: 5, type: 'scale', label: 'I\'d rather work alone than in a team.' },
      { id: 'q61', section: 5, type: 'scale', label: 'I find it hard to say no to things, even when I\'m overwhelmed.' },
      { id: 'q62', section: 5, type: 'scale', label: 'My physical health (sleep, exercise, diet) directly affects my mental state.' },
      { id: 'q63', section: 5, type: 'scale', label: 'I\'ve been called "scattered" or told I have too many interests.' },
      { id: 'q64', section: 5, type: 'scale', label: 'When I\'m stressed, I tend to shut down rather than push through.' }
    ]
  },
  {
    id: 6,
    title: 'Interests & Skills',
    icon: 'Sparkles',
    description: 'Let\'s figure out what you\'re actually good at.',
    encouragement: 'You know what you\'re good at. Now let\'s figure out what\'s in the way.',
    questions: [
      {
        id: 'q65', section: 6, type: 'multiselect',
        label: 'Pick everything you\'re genuinely interested in:',
        options: [
          'Photography/Videography', 'Writing/Storytelling', 'Graphic Design/Visual Art',
          'Music/Audio Production', 'Social Media/Content Creation', 'Sales/Talking to People',
          'Cooking/Food', 'Fitness/Health', 'Tech/Coding/Building Things',
          'Teaching/Explaining Things', 'Travel/Cultural Experiences', 'Fashion/Style',
          'Psychology/Understanding People', 'Events/Organising Things', 'Business/Entrepreneurship',
          'Film/Cinema', 'Sport/Coaching', 'Nature/Environment', 'Other'
        ]
      },
      { id: 'q66', section: 6, type: 'select', label: 'Of everything you selected, which ONE feels most like "you"?', options: [] },
      { id: 'q67', section: 6, type: 'scale', label: 'I\'m naturally good at making things look or sound good.' },
      { id: 'q68', section: 6, type: 'scale', label: 'I\'m the person people come to when they need advice.' },
      { id: 'q69', section: 6, type: 'scale', label: 'I can explain complicated things in a way that makes sense to others.' },
      { id: 'q70', section: 6, type: 'scale', label: 'I notice details that other people miss.' },
      { id: 'q71', section: 6, type: 'scale', label: 'I\'m good at convincing or persuading people.' },
      { id: 'q72', section: 6, type: 'scale', label: 'I can pick up new skills faster than most people I know.' },
      {
        id: 'q73', section: 6, type: 'select', label: 'Have you ever made money from a skill or talent, even informally?',
        options: ['Yes, multiple times', 'Once or twice', 'No, but I\'ve thought about it', 'No, and I wouldn\'t know where to start']
      },
      {
        id: 'q74', section: 6, type: 'select', label: 'Have you tried to build something on your own before?',
        options: ['Yes, multiple times', 'Once or twice', 'I\'ve thought about it a lot but never started', 'No, this is all new']
      },
      {
        id: 'q75', section: 6, type: 'select', label: 'If yes — why did it stop? (optional)', optional: true,
        options: ['I lost motivation or interest', 'I didn\'t know the next step', 'Life got in the way', 'I was scared of failing or being judged', 'It actually went okay, I just didn\'t keep going', 'It hasn\'t stopped, I\'m still building it', 'Other']
      },
      {
        id: 'q76', section: 6, type: 'select', label: 'How do you learn best?',
        options: ['Watching someone else do it first', 'Just trying it and figuring it out', 'Reading or researching before I start', 'Having someone walk me through it step by step']
      },
      {
        id: 'q77', section: 6, type: 'select', label: 'Do you want to build something online, in person, or both?',
        options: ['Online — I want location freedom', 'In person — I like being hands-on', 'Both — a mix feels right', 'Not sure yet']
      },
      {
        id: 'q78', section: 6, type: 'select', label: 'What kind of work environment sounds best?',
        options: ['Working alone, on my own schedule', 'Small team working on something we all care about', 'Being around people but doing my own thing', 'I don\'t know yet']
      }
    ]
  },
  {
    id: 7,
    title: "What's in the Way",
    icon: 'Shield',
    description: 'The honest section. What\'s actually stopping you.',
    encouragement: 'One more section. You\'ve made it this far — don\'t stop now. The last one is the most important.',
    questions: [
      {
        id: 'q79', section: 7, type: 'select', label: 'What\'s the biggest thing holding you back right now?',
        options: [
          'I don\'t know what direction to go',
          'I know what I want but I\'m scared to start',
          'I keep starting things and not finishing them',
          'I don\'t think I\'m good enough yet',
          'I can\'t afford to take the risk',
          'My parents wouldn\'t support it',
          'I don\'t have anyone around me doing this',
          'I\'m stuck in a situation I can\'t easily leave'
        ]
      },
      { id: 'q80', section: 7, type: 'scale', label: 'Fear of failure holds me back from taking action.' },
      { id: 'q81', section: 7, type: 'scale', label: 'Fear of what other people think holds me back from putting myself out there.' },
      { id: 'q82', section: 7, type: 'scale', label: 'I\'m scared that if I commit to one direction, I\'ll choose wrong.' },
      { id: 'q83', section: 7, type: 'scale', label: 'I feel like I need permission from someone to start.' },
      { id: 'q84', section: 7, type: 'scale', label: 'I tell myself I\'ll start "when the time is right" but the time never feels right.' },
      { id: 'q85', section: 7, type: 'scale', label: 'Part of me doesn\'t believe I can actually build a life on my own terms.' },
      {
        id: 'q86', section: 7, type: 'select', label: 'What\'s your relationship with taking action on things that scare you?',
        options: [
          'I usually go for it eventually, even if I\'m nervous',
          'I overthink it until the moment passes',
          'I take action in bursts but struggle with consistency',
          'I avoid it — I\'d rather wait until I feel ready'
        ]
      },
      {
        id: 'q87', section: 7, type: 'select', label: 'Have you spent money on a course, program, or tool to try to figure this out?',
        options: ['Yes, and it helped', 'Yes, and it didn\'t really help', 'Yes, multiple times, and I\'m frustrated', 'No, this would be my first time']
      },
      {
        id: 'q88', section: 7, type: 'select', label: 'Do you believe you can build a life on your own terms?',
        options: [
          'I genuinely believe I can, I just need help',
          'Part of me believes it, part of me doubts it',
          'I struggle to believe it most days',
          'I go back and forth depending on my mood'
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'The Deep Cut',
    icon: 'MessageSquare',
    description: 'Seven questions. No right answers. Just honesty. This is the most important part of the assessment.',
    encouragement: 'Done. Your report is being generated.',
    questions: [
      { id: 'q89', section: 8, type: 'text', label: 'What\'s the main thing that feels off about your life right now? Be honest.', placeholder: 'Take your time with this one...' },
      { id: 'q90', section: 8, type: 'text', label: 'If money and other people\'s opinions weren\'t a factor, what would you spend your days doing?', placeholder: 'Don\'t edit yourself here...' },
      { id: 'q91', section: 8, type: 'text', label: 'When you imagine your ideal life 2 years from now, what does a typical day look like?', placeholder: 'Be specific — what time do you wake up, what do you do, who are you with...' },
      { id: 'q92', section: 8, type: 'text', label: 'When was the last time you felt truly alive — like you were doing exactly what you were meant to be doing? Describe the moment.', placeholder: 'It can be something small...' },
      { id: 'q93', section: 8, type: 'text', label: 'What\'s the story you tell yourself about why you haven\'t started yet?', placeholder: 'The internal narrative...' },
      { id: 'q94', section: 8, type: 'text', label: 'What are you most afraid of being true about yourself?', placeholder: 'The scary thought...' },
      { id: 'q95', section: 8, type: 'text', label: 'Is there anything else you want to say? Anything on your chest that you\'ve never said out loud? This is just for you and your report.', placeholder: 'This goes nowhere except your report...' }
    ]
  }
]

export const TOTAL_QUESTIONS = SECTIONS.reduce((acc, s) => acc + s.questions.length, 0)

// Group scale questions into batches of up to 6
export function getScaleBatches(questions: Question[]): Question[][] {
  const scaleQs = questions.filter(q => q.type === 'scale')
  const batches: Question[][] = []
  for (let i = 0; i < scaleQs.length; i += 6) {
    batches.push(scaleQs.slice(i, i + 6))
  }
  return batches
}
