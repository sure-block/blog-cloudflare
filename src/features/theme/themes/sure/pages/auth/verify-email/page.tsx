import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { VerifyEmailPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

/** Sure 主题邮箱验证页 — 玻璃拟态 */
export function VerifyEmailPage({ status, error }: VerifyEmailPageProps) {
  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/60">
          [ {m.verify_email_header()} ]
        </p>
        <h1 className="text-3xl font-serif font-bold text-gradient tracking-tight">
          {status === "ANALYZING" && m.verify_email_analyzing_title()}
          {status === "SUCCESS" && m.verify_email_success_title()}
          {status === "ERROR" && m.verify_email_error_title()}
        </h1>
      </header>

      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        {status === "ANALYZING" && (
          <div className="flex items-center gap-3 text-muted-foreground/60">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest">
              {m.verify_email_analyzing_desc()}
            </span>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="text-center space-y-6 fade-in-up">
            <CheckCircle2 className="w-16 h-16 mx-auto text-primary/70" />
            <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
              {m.verify_email_success_desc()}
            </p>
            <Link
              to="/"
              className="glass-button px-6 py-3 text-sm text-foreground inline-block !bg-indigo-500/15 hover:!bg-indigo-500/25"
            >
              {m.verify_email_success_action()}
            </Link>
          </div>
        )}

        {status === "ERROR" && (
          <div className="text-center space-y-6 fade-in-up">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive/70" />
            <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
              {error === "invalid_token"
                ? m.verify_email_error_invalid_token_desc()
                : m.verify_email_error_generic_desc()}
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="glass-button px-6 py-3 text-sm text-foreground inline-block"
              >
                {m.verify_email_error_action()}
              </Link>
              <Link
                to="/login"
                className="block text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                [ {m.verify_email_error_resend_action()} ]
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
