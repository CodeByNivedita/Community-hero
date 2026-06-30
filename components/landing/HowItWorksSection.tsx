"use client"

import * as React from "react"
import { motion } from "framer-motion"

const STEPS = [
  { 
    id: 1, 
    title: "Report Issue", 
    desc: "Submit issues with photos" 
  },
  { 
    id: 2, 
    title: "AI Analysis", 
    desc: "AI analyzes and categorizes" 
  },
  { 
    id: 3, 
    title: "Community Action", 
    desc: "Heroes take action and" 
  },
  { 
    id: 4, 
    title: "Track Impact", 
    desc: "Track progress and see" 
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#052E16] mb-3">
          How It Works
        </h2>
        <p className="text-[15px] text-gray-500 mb-12">
          Simple steps to make a big difference in your community
        </p>

        {/* Grid of steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow flex items-start gap-4 text-left"
            >
              {/* Green Number Circle */}
              <div className="w-8 h-8 rounded-full bg-[#10B981] shrink-0 flex items-center justify-center text-white font-bold text-sm mt-0.5">
                {step.id}
              </div>
              
              {/* Text Content */}
              <div>
                <h3 className="text-[15px] font-extrabold text-[#052E16] mb-1 leading-tight">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-snug">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
