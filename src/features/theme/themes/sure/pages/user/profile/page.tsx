import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type { ProfilePageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

/** Sure 主题个人资料页 — 玻璃拟态 */
export function ProfilePage({
  user,
  profileForm,
  passwordForm,
  notification,
  logout,
}: ProfilePageProps) {
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    errors: profileErrors,
    isSubmitting: isProfileSubmitting,
  } = profileForm;

  const password = passwordForm
    ? {
        register: passwordForm.register,
        handleSubmit: passwordForm.handleSubmit,
        errors: passwordForm.errors,
        isSubmitting: passwordForm.isSubmitting,
      }
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-10 py-6 md:py-12 flex flex-col gap-6">
      {/* Header */}
      <header className="glass-card p-6 md:p-8 fade-in-up shadow-2xl flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            {m.profile_settings()}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {m.profile_settings_desc()}
          </p>
        </div>
        <Link to="/" className="glass-button px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          {m.profile_back_home()}
        </Link>
      </header>

      {/* 个人资料表单 */}
      <section className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
        <h3 className="font-serif text-lg font-bold text-foreground mb-6">
          {m.profile_basic_info()}
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover gradient-ring p-[2px]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center font-serif text-xl text-gradient">
                {user.name?.slice(0, 1)}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              {m.profile_name()}
            </label>
            <input
              {...registerProfile("name")}
              className="glass-input w-full text-foreground"
            />
            {profileErrors.name && (
              <p className="text-xs text-destructive">{profileErrors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isProfileSubmitting}
            className="glass-button px-6 py-2.5 text-sm text-foreground disabled:opacity-50 !bg-indigo-500/15 hover:!bg-indigo-500/25"
          >
            {isProfileSubmitting ? (
              <Loader2 size={14} className="animate-spin inline" />
            ) : null}
            {m.profile_save_changes()}
          </button>
        </form>
      </section>

      {/* 修改密码 */}
      {password && (
        <section className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
          <h3 className="font-serif text-lg font-bold text-foreground mb-6">
            {m.profile_new_password()}
          </h3>
          <form onSubmit={password.handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {m.profile_current_password()}
              </label>
              <input
                type="password"
                {...password.register("currentPassword")}
                className="glass-input w-full text-foreground"
              />
              {password.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {password.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {m.profile_new_password()}
              </label>
              <input
                type="password"
                {...password.register("newPassword")}
                className="glass-input w-full text-foreground"
              />
              {password.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {password.errors.newPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={password.isSubmitting}
              className="glass-button px-6 py-2.5 text-sm text-foreground disabled:opacity-50 !bg-indigo-500/15 hover:!bg-indigo-500/25"
            >
              {password.isSubmitting ? (
                <Loader2 size={14} className="animate-spin inline" />
              ) : null}
              {m.profile_save_changes()}
            </button>
          </form>
        </section>
      )}

      {/* 通知设置 */}
      {notification.available ? (
        <section className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
          <h3 className="font-serif text-lg font-bold text-foreground mb-6">
            {m.profile_preferences()}
          </h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">
              {m.profile_email_notify()}
            </span>
            <input
              type="checkbox"
              checked={Boolean(notification.enabled)}
              onChange={notification.toggle}
              className="w-5 h-5 accent-indigo-500"
            />
          </label>
        </section>
      ) : null}

      {/* 退出登录 */}
      <section className="glass-card p-6 md:p-8 fade-in-up shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground">
              {m.profile_logout()}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {m.profile_preferences()}
            </p>
          </div>
          <button
            onClick={logout}
            className={cn(
              "glass-button px-6 py-2.5 text-sm text-destructive hover:!bg-destructive/10",
            )}
          >
            {m.profile_logout()}
          </button>
        </div>
      </section>
    </div>
  );
}
