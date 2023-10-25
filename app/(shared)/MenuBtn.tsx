import * as React from "react";
import { motion } from "framer-motion";

interface PathProps {
  d?: string;
  variants: {
    closed: { d: string; opacity?: number };
    open: { d: string; opacity?: number };
  };
  transition?: { duration: number };
  initial?: string | boolean
}

const Path: React.FC<PathProps> = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="lightgray"
    strokeLinecap="round"
    {...props}
  />
);

interface MenuBtnProps {
  toggle: () => void;
  menuOpen: boolean
}

export const MenuBtn: React.FC<MenuBtnProps> = ({ toggle, menuOpen }) => (
  <button onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
        initial={menuOpen && 'open'}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { d: "M 2 9.423 L 20 9.423", opacity: 1 },
          open: { d: "M 2 9.423 L 20 9.423", opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
        initial={menuOpen && 'open'}
      />
    </svg>
  </button>
);
