import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Linkedin, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formElement = e.target;
    const formDataObj = new FormData(formElement);

    // Ensure Web3Forms access key and recipient
    formDataObj.set("access_key", "0562216d-f078-4c0a-8d17-850966cf8e33");
    formDataObj.set("to_email", "anupbubay9986@gmail.com");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully! I'll respond promptly.");
        formElement.reset();
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Unable to send message: " + (data.message || "Please try again later."));
      }
    } catch (error) {
      toast.error("Something went wrong. Please reach out directly via email.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "anupbubay9986@gmail.com",
      link: "mailto:anupbubay9986@gmail.com",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "Send an email to Anup Kundu",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      value: "linkedin.com/in/anupkundu-linkdin",
      link: "https://www.linkedin.com/in/anupkundu-linkdin/",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "Connect with Anup Kundu on LinkedIn (opens in new tab)",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "WhatsApp",
      value: "+91 9531763641",
      link: "https://wa.me/919531763641",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "Message Anup Kundu on WhatsApp (opens in new tab)",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "Kolkata, West Bengal, India",
      link: "https://maps.app.goo.gl/VvZkFbky7b6CqX6J9",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "View Kolkata, India on Google Maps (opens in new tab)",
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 relative overflow-hidden"
      aria-label="Contact and Hiring Opportunities"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Opportunities & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Final-Year Computer Science student actively seeking Software Engineering internships and junior full-stack developer roles. Let's discuss how I can contribute to your engineering team.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column - Contact Details & Direct Channels (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Let's <span className="text-gradient">Connect</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                Whether you have an internship opening, a junior developer position, or would like to explore my code repositories, I welcome your message.
              </p>
            </div>

            <div className="space-y-3.5">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.link}
                  target={info.target}
                  rel={info.rel}
                  aria-label={info.ariaLabel}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center gap-4 p-4 glass-effect rounded-xl border border-border/40 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-primary bg-primary/10 p-3 rounded-lg group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shrink-0">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-xs tracking-wider uppercase">
                      {info.label}
                    </p>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors truncate">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Contact Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 glass-effect p-6 sm:p-8 md:p-10 rounded-2xl border border-border/40 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
              <input
                type="hidden"
                name="access_key"
                value="0562216d-f078-4c0a-8d17-850966cf8e33"
              />
              <input
                type="hidden"
                name="to_email"
                value="anupbubay9986@gmail.com"
              />
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="hidden"
                name="from_name"
                value="Anup Kundu Portfolio Contact Form"
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2"
                  >
                    Your Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-background/60 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all duration-200"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2"
                  >
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-background/60 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all duration-200"
                    placeholder="e.g. sarah@company.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2"
                >
                  Subject / Opportunity Type <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-background/60 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all duration-200"
                  placeholder="e.g. Software Engineering Internship Opportunity"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2"
                >
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-background/60 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all duration-200 resize-none"
                  placeholder="Details about the role, team, or project..."
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full btn-hero flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-semibold py-3.5"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                ) : (
                  <>
                    <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
