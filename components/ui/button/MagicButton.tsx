import React from 'react'

type MagicButtonProps = {
  title: string;
  icon: React.ReactNode;
  position: 'left' | 'right';
  handleClick?: () => void;
  otherClasses?: string;
  /**
   * When provided the control renders as an anchor instead of a button.
   * Navigation must be an <a> so Cmd/Ctrl-click and middle-click work, and so
   * a <button> is never nested inside a link (invalid, and a double tab stop).
   */
  href?: string;
  ariaLabel?: string;
};

// focus:outline-none used to be applied with no replacement, leaving keyboard
// users with no visible focus target. Ring is on the outer element so it frames
// the whole pill rather than the inner span.
const shell =
  "relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100";

const MagicButton = ({
  title, icon, position, handleClick, otherClasses, href, ariaLabel,
}: MagicButtonProps) => {
  const inner = (
    <>
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] motion-reduce:animate-none" />
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClasses ?? ''}`}
      >
        {position === 'left' && icon}
        {title}
        {position === 'right' && icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={shell} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={shell} onClick={handleClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
};

export default MagicButton
