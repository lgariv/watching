import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button, Card } from "@heroui/react";
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { ShineBorder } from "@/components/magicui/shine-border";

type Props = {};

const AboutPage = (props: Props) => {
	return (
        <main className="font-heebo overscroll-y-none" dir="ltr">
            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                )}
            />
            <div className="relative flex md:min-h-screen lg:min-h-screen flex-col items-center justify-center p-4 pt-20">
                <Card className="max-w-4xl z-10 p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl text-foreground -my-2">
                                About{" "}
                                <span className="font-chakra">
                                    Watching
                                </span>
                            </h1>
                            <h2 className="text-lg md:text-xl text-foreground/75 mt-2">
                                Developed by{" "}
                                <a
                                    href="https://www.linkedin.com/in/lavie-gariv/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Lavie Gariv
                                </a>
                            </h2>
                        </div>
                        <Image
                            src="https://media.licdn.com/dms/image/v2/D4E03AQHA8OANx3jqDQ/profile-displayphoto-shrink_800_800/B4EZOvY7Z3HEAc-/0/1733814368868?e=1747267200&v=beta&t=Ma88o812e6QdCucW7A5uqXwYI9CHT8ZYCJZAfQT8cA0"
                            alt="Vision Creator"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                            width={128}
                            height={128}
                        />
                    </div>
                    <div>
                        <p className="mb-6 text-lg text-foreground text-pretty">
                            Watching is a web application designed to help users discover 
                            their new favorite movies and TV shows through personalized recommendations. 
                            The project was developed with{" "}
                            <strong>Next.js</strong>, using <strong>shadcn/ui</strong> and <strong>HeroUI</strong> for customized 
                            and accessible UI components and <strong>Tailwind CSS</strong> for responsive
                            and modern styling. The application offers an intuitive and convenient interface for exploring content 
                            based on user preferences, and ensures fast performance and design supported on all devices.
                        </p>

                        <hr className="my-4 border-foreground/10 border-t-[2.5px] rounded-lg" />

                        <p className="text-lg text-foreground font-bold">
                            The project uses a modern architecture that includes:
                        </p>
                        <ul className="mb-6 text-lg text-foreground list-disc list-inside">
                            <li>
                                <strong>Vercel</strong>: Responsible for Frontend deployment, using a CDN network that enables fast loading and optimal user experience anywhere in the world.
                            </li>
                            <li>
                                <strong>Fluid-compute Serverless Functions</strong>: Provide efficient and scalable backend infrastructure with seamless communication between frontend and backend.
                            </li>
                            <li>
                                <strong>OpenAI API</strong>: Integration with an advanced AI model from DeepSeek and prompt engineering techniques for analyzing user preferences and creating accurate recommendations.
                            </li>
                            <li>
                                <strong>Upstash</strong>: Implements rate limiting functionality using a Redis instance to ensure fair usage of the application's resources and prevent abuse of the AI recommendation system.
                            </li>
                            <li>
                                <strong>Clerk</strong>: Handles user authentication and authorization, providing secure access to protected routes and ensuring that only authenticated users can access personalized features.
                            </li>
                        </ul>

                        <hr className="my-4 border-foreground/10 border-t-[2.5px] rounded-lg" />

                        <p className="mb-6 text-lg text-foreground">
                            The combination of modern technologies and advanced AI methods allows for creating an engaging and responsive user experience for discovering entertainment content in three simple steps.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-4 w-full">
                        <Button
                            as="a"
                            href="https://github.com/lgariv/Watching"
                            startContent={<Github />}
                            className="font-bold font-sans border-2 dark:border-0 border-[#333]"
                            style={{
                                backgroundColor: "#eee",
                                color: "#333",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </Button>
                        <Button
                            as="a"
                            href="https://www.linkedin.com/in/lavie-gariv/"
                            startContent={<Linkedin />}
                            className="font-bold font-sans"
                            style={{
                                backgroundColor: "#0077B5",
                                color: "#fff",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </Button>
                    </div>
                    <ShineBorder borderWidth={2} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                </Card>
            </div>
        </main>
	);
};

export default AboutPage;
