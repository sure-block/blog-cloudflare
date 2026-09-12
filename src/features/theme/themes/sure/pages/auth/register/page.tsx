import { Link } from "@tanstack/react-router";
import type { RegisterPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { RegisterForm } from "@/features/theme/themes/default/pages/auth/register/form";

/** Sure 主题注册页 — 玻璃拟态 */
export function RegisterPage({
  registerForm,
  turnstileElement,
}: RegisterPageProps) {
  if (registerForm.isSuccess) {
    return (
      <div className="text-center space-y-8 fade-in-up">
        <div className="space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
            [ {m.register_success_label()} ]
          </p>
          <h3 className="text-xl font-serif font-medium tracking-tight text-foreground">
            {m.register_success_title()}
          </h3>
          <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
            {m.register_success_desc()}
          </p>
        </div>
        <Link
          to="/login"
          className="glass-button px-6 py-3 text-sm text-foreground inline-block"
        >
          {m.register_back_to_login()}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground/60">
          [ {m.register_label()} ]
        </p>
        <h1 className="text-3xl font-serif font-bold text-gradient tracking-tight">
          {m.register_title()}
        </h1>
      </header>

      <div className="space-y-8">
        <RegisterForm form={registerForm} />

        {turnstileElement}

        <div className="text-center pt-2">
          <p className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">
            {m.register_have_account()}{" "}
            <Link
              to="/login"
              className="text-foreground hover:opacity-70 transition-opacity ml-1"
            >
              [ {m.register_go_to_login()} ]
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
