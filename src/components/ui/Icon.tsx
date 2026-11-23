import type { IconType } from "react-icons";
import { RiOpenaiLine } from "react-icons/ri";
import {
  SiClaude,
  SiFastapi,
  SiFirebase,
  SiFlutter,
  SiGooglegemini,
  SiHuggingface,
  SiLangchain,
  SiLanggraph,
  SiOpenjdk,
  SiPydantic,
  SiPytorch,
  SiRazorpay,
  SiScikitlearn,
  SiSqlalchemy,
  SiSupabase,
} from "react-icons/si";

const techIcons: Record<string, IconType> = {
  claude: SiClaude,
  fastapi: SiFastapi,
  firebase: SiFirebase,
  flutter: SiFlutter,
  gemini: SiGooglegemini,
  "hugging-face": SiHuggingface,
  java: SiOpenjdk,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  openai: RiOpenaiLine,
  pydantic: SiPydantic,
  pytorch: SiPytorch,
  razorpay: SiRazorpay,
  "scikit-learn": SiScikitlearn,
  sqlalchemy: SiSqlalchemy,
  supabase: SiSupabase,
};

type IconProps = { name: string; size?: number; className?: string };

export function Icon({ name, size = 14, className = "" }: IconProps) {
  const TechIcon = techIcons[name];
  if (TechIcon) {
    return (
      <TechIcon
        size={size}
        className={`icon ${className}`}
        aria-hidden="true"
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
