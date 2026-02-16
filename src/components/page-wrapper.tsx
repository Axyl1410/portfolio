"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

const PageWrapper = (props: HTMLMotionProps<"div">) => {
  return (
    <div className="bg-white">
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 1 }}
        {...props}
      />
    </div>
  );
};

export default PageWrapper;
