import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/anupkundu2024",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/anupkundu-linkdin/",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://x.com/anupkundu_",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/profile.php?id=61563913023455", 
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/anupkundu__/", 
    },
    {
      name: "Linktree",
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.92,2.44a1.06,1.06,0,0,0-1.86,0L.1,15.07A1,1,0,0,0,1,16.44h4.7v4.78a.9.9,0,0,0,.89.89H9.33a.91.91,0,0,0,.89-.89V16.44H8.92a1.05,1.05,0,0,1-1-.89A1,1,0,0,1,8,15l3.89-6.92Z" />
              <path d="M15.08,2.44a1.06,1.06,0,0,1,1.86,0l7,12.63A1,1,0,0,1,23,16.44H18.3v4.78a.9.9,0,0,1-.89.89H14.67a.91.91,0,0,1-.89-.89V16.44h1.3a1.05,1.05,0,0,0,1-.89,1,1,0,0,0-.1-.55L12.08,8.08Z" />
            </svg>,
      url: "https://linktr.ee/anup_kundu", 
    },
  ];

  return (
    <footer className="border-t border-border/20 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              © 2024 Anup. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Built with React, Three.js & lots of ☕
            </p>
          </div>

          <div className="flex gap-6 flex-wrap justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
