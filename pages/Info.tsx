
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Shield, FileText } from 'lucide-react';

type InfoPage = 'privacy' | 'terms';

export const Info: React.FC<{ page: InfoPage }> = ({ page }) => {
  const isPrivacy = page === 'privacy';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="max-w-4xl mx-auto px-8 py-8 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-600 hover:text-indigo-600 font-bold transition-colors"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Zap size={20} strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Axent<span className="text-indigo-600">AI</span></span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            {isPrivacy ? <Shield size={28} /> : <FileText size={28} />}
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Use'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Last updated: February 2026
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
          {isPrivacy ? (
            <>
              <h2 className="text-xl font-black text-slate-900 mt-0">1. Information We Collect</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Axent AI stores your profile (name, email, branch, study preferences), academic data (subjects, topics, schedule), and usage data locally in your browser. With your consent, data may be synced to our secure cloud to enable cross-device access.
              </p>
              <h2 className="text-xl font-black text-slate-900">2. How We Use It</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Your data is used solely to personalize your study plan, generate AI-powered roadmaps and schedules, and improve your experience. We do not sell or share your personal information with third parties for marketing.
              </p>
              <h2 className="text-xl font-black text-slate-900">3. Data Security</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We use industry-standard practices to protect your data. You can export or delete your data at any time from the Dashboard.
              </p>
              <h2 className="text-xl font-black text-slate-900">4. Contact</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                For privacy-related questions, contact us through the app or the details provided on the main site.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-slate-900 mt-0">1. Acceptance</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                By using Axent AI, you agree to these Terms of Use. If you do not agree, please do not use the service.
              </p>
              <h2 className="text-xl font-black text-slate-900">2. Use of Service</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Axent AI is an educational planning tool. You are responsible for the accuracy of the information you provide and for how you use the generated plans. The AI-generated content is for guidance only and does not replace official academic advice.
              </p>
              <h2 className="text-xl font-black text-slate-900">3. Intellectual Property</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                The Axent AI brand, interface, and original content are owned by the project. Your personal data and study content remain yours.
              </p>
              <h2 className="text-xl font-black text-slate-900">4. Limitation of Liability</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Axent AI is provided &quot;as is.&quot; We are not liable for any outcomes resulting from your use of the app, including academic results or decisions made based on AI suggestions.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
