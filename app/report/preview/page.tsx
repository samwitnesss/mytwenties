import ReportPage from '../ReportContent'
import { mockReport } from '@/lib/mock-report'

export default function PreviewReportPage() {
  return <ReportPage report={mockReport} />
}
