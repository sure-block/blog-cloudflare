import { Link } from "@tanstack/react-router";
import type { ResetPasswordPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { ResetPasswordForm } from "@/features/theme/themes/default/pages/auth/reset-password/form";

/** Sure 主题重置密码页 — 玻璃拟态 */
export function ResetPasswordPage({
  resetPasswordForm,
  token,
  error,
}: ResetPasswordPageProps) {
  if (!token && !error) {
    return (
      <div className="text-center space-y-6 fade-in-up">
        <p className="text-sm text-destructive/70 font-light">
          {m.reset_password_error_missing_token()}
        </p>
        <Link
          to="/login"
          className="glass-button px-6 py-3 text-sm text-foreground inline-block"
        >
          {m.register_back_to_login()}
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-6 fade-in-up">
        <p className="text-sm text-destructive/70 font-light">
          {m.reset_password_error_invalid_link({ error: error || "" })}
        </p>
        <Link
          to="/forgot-password"
          className="glass-button px-6 py-3 text-sm text-foreground inline-block"
        >
          {m.reset_password_request_new_link()}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/60">
          [ {m.reset_password_label()} ]
        </p>
        <h1 className="text-3xl font-serif font-bold text-gradient tracking-tight">
          {m.reset_password_title()}
        </h1>
      </header>

      <ResetPasswordForm form={resetPasswordForm} />
    </div>
  );
}
