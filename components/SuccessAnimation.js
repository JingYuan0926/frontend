'use client';

import Lottie from "lottie-react";
import successAnimation from "../public/lottie.json";

export default function SuccessAnimation() {
  return (
    <div className="w-32 h-32 mb-4">
      <Lottie
        animationData={successAnimation}
        loop={false}
        autoplay={true}
      />
    </div>
  );
} 