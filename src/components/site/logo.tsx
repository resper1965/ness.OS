import Link from "next/link";

type LogoProps = {
  variant?: "dark" | "light";
  size?: "sm" | "default" | "lg";
  className?: string;
  href?: string;
};

const sizeClasses = {
  sm: "text-xl",
  default: "text-2xl",
  lg: "text-3xl",
};

export function Logo({
  variant = "light",
  size = "default",
  className = "",
  href = "/",
}: LogoProps) {
  const textColor = variant === "dark" ? "text-slate-900" : "text-white";

  const content = (
    <span
      className={`font-montserrat font-medium ${textColor} ${sizeClasses[size]} ${className}`}
    >
      ness
      <span className="text-ness">.</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
