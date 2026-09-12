import { Link } from "@tanstack/react-router";
import type { ForgotPasswordPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { ForgotPasswordForm } from "@/features/theme/themes/default/pages/auth/forgot-password/form";

/** Sure 主题找回密码页 — 玻璃拟态 */
export function ForgotPasswordPage({
  forgotPasswordForm,
  turnstileElement,
}: ForgotPasswordPageProps) {
  if (forgotPasswordForm.isSent) {
    return (
      <div className="text-center space-y-8 fade-in-up">
        <div className="space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
            [ {m.forgot_password_success_label()} ]
          </p>
          <h3 className="text-xl font-serif font-medium tracking-tight text-foreground">
            {m.forgot_password_success_title()}
          </h3>
          <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
            {m.forgot_password_success_desc({
              email: forgotPasswordForm.sentEmail,
            })}
          </p>
        </div>
        <Link
          to="/login"
          className="glass-button px-6 py-3 text-sm text-foreground inline-block"
        >
          {m.forgot_password_back_to_login()}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/60">
          [ {m.forgot_password_label()} ]
        </p>
        <h1 className="text-3xl font-serif font-bold text-gradient tracking-tight">
          {m.forgot_password_title()}
        </h1>
      </header>

      <div className="space-y-6">
        <ForgotPasswordForm form={forgotPasswordForm} />
        {turnstileElement}
      </div>
    </div>
  );
}
