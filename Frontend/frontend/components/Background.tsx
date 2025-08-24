import { motion } from "framer-motion";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"


function FloatingPaths({ position }: { position: number }) {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [windowWidth, setWindowWidth] = React.useState(0);
    // const position = 1;

    
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    React.useEffect(() => {
    
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const mouseInfluence =
    windowWidth > 0 ? (mousePosition.x / windowWidth - 0.5) * 100 : 0;

  type Path = {
    id: number;
    d: string;
    width: number;
  };

  const paths: Path[] = Array.from({ length: 20 }, (_, i) => {
    return {
      id: i,
      d: `M-${380 - i * 8 * position + mouseInfluence} -${189 + i * 8}
          C-${380 - i * 8 * position + mouseInfluence} -${189 + i * 8}
           -${312 - i * 8 * position + mouseInfluence * 0.5} ${216 - i * 8}
           ${152 - i * 8 * position + mouseInfluence * 0.3} ${343 - i * 8}
          C${616 - i * 8 * position + mouseInfluence * 0.2} ${470 - i * 8}
           ${684 - i * 8 * position + mouseInfluence * 0.1} ${875 - i * 8}
           ${684 - i * 8 * position + mouseInfluence * 0.1} ${875 - i * 8}`,
      width: 0.8 + i * 0.05,
    };
  });

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-blue-600/20 dark:text-cyan-400/20"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Interactive Code Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.2 + path.id * 0.04}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 0.7],
                            opacity: [0.2, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 15 + path.id * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: path.id * 0.5,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

function ScrollingLogos() {
    const logos = [
        { name: "React", url: "https://svgl.app/library/react_light.svg", darkUrl: "https://svgl.app/library/react_dark.svg" },
        { name: "Go", url: "https://svgl.app/library/golang.svg", darkUrl: "https://svgl.app/library/golang_dark.svg" },
        { name: "Swift", url: "https://svgl.app/library/swift.svg" },
        { name: "Vue", url: "https://svgl.app/library/vue.svg" },
        { name: "Python", icon: "🐍" },
        { name: "JavaScript", icon: "🟨" },
        { name: "TypeScript", icon: "🔷" },
        { name: "Java", icon: "☕" },
        { name: "C++", icon: "⚡" },
        { name: "Rust", icon: "🦀" },
        { name: "PHP", icon: "🐘" },
        { name: "Ruby", icon: "💎" },
        { name: "C#", icon: "🔷" },
        { name: "Kotlin", icon: "🎯" },
        { name: "Dart", icon: "🎯" },
        { name: "Scala", icon: "🎭" },
    ];

    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden bg-gradient-to-t from-white/50 to-transparent dark:from-neutral-950/50">
            <motion.div
                className="flex items-center h-full gap-8 whitespace-nowrap"
                animate={{ x: ["-100%", "0%"] }}
                transition={{
                    duration: 60,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <motion.div
                        key={`${logo.name}-${index}`}
                        className="flex flex-col items-center gap-1 min-w-[80px] group cursor-pointer"
                        whileHover={{ scale: 1.2, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {logo.url ? (
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img 
                                    src={logo.url} 
                                    alt={logo.name}
                                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ) : (
                            <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                                {logo.icon}
                            </div>
                        )}
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                            {logo.name}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export function BackgroundPaths({
    title = "DevQuiz",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>
            <ScrollingLogos />

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="max-w-2xl mx-auto mb-8"
                    >
                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Test your programming skills with interactive quizzes covering{" "}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                all programming languages
                            </span>
                            . From Python to JavaScript, C++ to Rust - challenge yourself and{" "}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                track your progress
                            </span>{" "}
                            across multiple coding domains.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
                    >
                        <motion.div 
                            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg p-4 border border-neutral-200/50 dark:border-neutral-700/50 group hover:border-blue-300/50 dark:hover:border-cyan-400/50 transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💻</div>
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                                Syntax Mastery
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Master syntax from Python loops to Rust ownership
                            </p>
                        </motion.div>
                        <motion.div 
                            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg p-4 border border-neutral-200/50 dark:border-neutral-700/50 group hover:border-green-300/50 dark:hover:border-emerald-400/50 transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧠</div>
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                                Algorithm Thinking
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Develop problem-solving skills across paradigms
                            </p>
                        </motion.div>
                        <motion.div 
                            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg p-4 border border-neutral-200/50 dark:border-neutral-700/50 group hover:border-purple-300/50 dark:hover:border-violet-400/50 transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                                Polyglot Developer
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Become fluent in 20+ programming languages
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}


export function DemoBackgroundPaths() {
    return (
        <div className="flex text-center items-center justify-center">
            <BackgroundPaths title="DevQuiz" />
        </div>
    )
}

export default DemoBackgroundPaths;