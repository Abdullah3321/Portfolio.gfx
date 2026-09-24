"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import styles from "./page.module.css";
import {
  initialAdminContent,
  type AdminContent,
  type AdminProject,
  type AdminTestimonial,
} from "@/lib/admin-data";

type AdminView = "overview" | "portfolio" | "profile" | "reviews" | "services" | "inquiries" | "analytics" | "settings";

type BarStyle = CSSProperties & { "--bar-height": string };

const navigation: { id: AdminView; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "↗" },
  { id: "portfolio", label: "Portfolio", icon: "▦" },
  { id: "profile", label: "Profile", icon: "◎" },
  { id: "reviews", label: "Reviews", icon: "❝" },
  { id: "services", label: "Services", icon: "◈" },
  { id: "inquiries", label: "Inquiries", icon: "✉" },
  { id: "analytics", label: "Analytics", icon: "⌁" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const emptyProject: AdminProject = {
  id: "",
  title: "",
  category: "",
  metric: "",
  description: "",
  media: "product",
  status: "Draft",
  featured: false,
  updatedAt: "Just now",
};

const emptyTestimonial: AdminTestimonial = {
  id: "",
  name: "",
  role: "",
  quote: "",
  imageUrl: "",
  sortOrder: 0,
};

export default function AdminShell() {
  const [content, setContent] = useState<AdminContent>(initialAdminContent);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [notice, setNotice] = useState("Demo mode: changes are saved in this browser only.");
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) setAuthRequired(true);
          throw new Error(response.status === 401 ? "Sign in required before using PostgreSQL persistence." : "Database content could not be loaded.");
        }
        return response.json() as Promise<Partial<AdminContent>>;
      })
      .then((remoteContent) => setContent((current) => ({ ...current, ...remoteContent })))
      .catch((error: Error) => setNotice(error.message));
  }, []);

  async function persist(nextContent: AdminContent, message = "Saved to PostgreSQL") {
    setContent(nextContent);
    const {
      siteTitle,
      siteDescription,
      contactEmail,
      maintenanceMode,
      analyticsEnabled,
      contactTitle,
      contactIntro,
      contactResponseTime,
      contactLocation,
      aboutIntro,
      aboutDetail,
      aboutProof,
      servicesIntro,
      portfolioIntro,
      caseStudiesIntro,
      experienceIntro,
    } = nextContent.settings;
    const payload = {
      services: nextContent.services,
      testimonials: nextContent.testimonials,
      settings: {
        siteTitle,
        siteDescription,
        contactEmail,
        maintenanceMode,
        analyticsEnabled,
        contactTitle,
        contactIntro,
        contactResponseTime,
        contactLocation,
        aboutIntro,
        aboutDetail,
        aboutProof,
        servicesIntro,
        portfolioIntro,
        caseStudiesIntro,
        experienceIntro,
      },
    };
    const response = await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("Could not save content to PostgreSQL.");
    setNotice(message);
  }

  function updateTestimonial(index: number, field: keyof AdminTestimonial, value: string) {
    setContent((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial, testimonialIndex) => testimonialIndex === index ? { ...testimonial, [field]: field === "sortOrder" ? Number(value) : value } : testimonial),
    }));
  }

  function addTestimonial() {
    setContent((current) => ({ ...current, testimonials: [...current.testimonials, { ...emptyTestimonial, id: crypto.randomUUID(), sortOrder: current.testimonials.length }] }));
  }

  function removeTestimonial(index: number) {
    setContent((current) => ({ ...current, testimonials: current.testimonials.filter((_, testimonialIndex) => testimonialIndex !== index).map((testimonial, sortOrder) => ({ ...testimonial, sortOrder })) }));
  }

  function uploadTestimonialImage(index: number, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const maxDimension = 800;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const compressedReader = new FileReader();
          compressedReader.onload = () => updateTestimonial(index, "imageUrl", String(compressedReader.result));
          compressedReader.readAsDataURL(blob);
        }, "image/jpeg", 0.82);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function saveTestimonials() {
    try {
      await persist(content, "Reviews saved to PostgreSQL");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save reviews to PostgreSQL.");
    }
  }

  async function updateProfile(field: keyof AdminContent["profile"], value: string) {
    const profile = { ...content.profile, [field]: value };
    setContent((current) => ({ ...current, profile }));
    const response = await fetch("/api/admin/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    if (!response.ok) setNotice("Could not save profile to PostgreSQL.");
    else setNotice("Profile saved to PostgreSQL");
  }

  async function saveProfile() {
    const response = await fetch("/api/admin/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content.profile) });
    setNotice(response.ok ? "Profile saved to PostgreSQL" : "Could not save profile to PostgreSQL.");
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProject?.title.trim()) return;
    const exists = content.projects.some((project) => project.id === editingProject.id);
    fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingProject) })
      .then(async (response) => { if (!response.ok) throw new Error("Could not save project to PostgreSQL."); return response.json() as Promise<AdminProject>; })
      .then((savedProject) => { setContent((current) => ({ ...current, projects: exists ? current.projects.map((project) => project.id === editingProject.id ? savedProject : project) : [...current.projects, savedProject] })); setNotice("Project saved to PostgreSQL"); })
      .catch((error: Error) => setNotice(error.message));
    setEditingProject(null);
  }

  function deleteProject(projectId: string) {
    if (!window.confirm("Remove this project from the demo portfolio?")) return;
    fetch(`/api/admin/projects?id=${encodeURIComponent(projectId)}`, { method: "DELETE" })
      .then((response) => { if (!response.ok) throw new Error("Could not remove project from PostgreSQL."); setContent((current) => ({ ...current, projects: current.projects.filter((project) => project.id !== projectId) })); setNotice("Project removed from PostgreSQL"); })
      .catch((error: Error) => setNotice(error.message));
  }

  function toggleInquiry(inquiryId: string) {
    fetch(`/api/admin/inquiries/${encodeURIComponent(inquiryId)}`, { method: "PATCH" })
      .then(async (response) => { if (!response.ok) throw new Error("Could not update inquiry."); return response.json(); })
      .then((updatedInquiry) => { setContent((current) => ({ ...current, inquiries: current.inquiries.map((inquiry) => inquiry.id === inquiryId ? updatedInquiry : inquiry) })); setNotice("Inquiry updated in PostgreSQL"); })
      .catch((error: Error) => setNotice(error.message));
  }

  function uploadProfileImage(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const compressedReader = new FileReader();
          compressedReader.onload = () => updateProfile("imageUrl", String(compressedReader.result));
          compressedReader.readAsDataURL(blob);
        }, "image/jpeg", 0.82);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function uploadResume(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    const response = await fetch("/api/admin/resume", { method: "POST", body: formData });
    if (!response.ok) {
      const result = await response.json().catch(() => null) as { error?: string } | null;
      setNotice(result?.error ?? "Could not upload resume.");
      return;
    }
    const resume = await response.json();
    setContent((current) => ({ ...current, resume }));
    setNotice("Resume uploaded to PostgreSQL");
  }

  const activeLabel = navigation.find((item) => item.id === activeView)?.label;

  if (authRequired) return <LoginPanel />;

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link className={styles.brand} href="/" aria-label="Back to portfolio">mehroz.</Link>
          <span className={styles.adminMark}>ADMIN / DEMO</span>
        </div>
        <nav className={styles.sideNav} aria-label="Admin navigation">
          {navigation.map((item) => (
            <button
              className={`${styles.sideLink} ${activeView === item.id ? styles.sideLinkActive : ""}`}
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
            >
              <span className={styles.sideIcon} aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.id === "inquiries" && <span className={styles.navCount}>{content.inquiries.filter((inquiry) => inquiry.status === "New").length}</span>}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.accountBadge}>M</div>
          <div>
            <strong>{content.profile.name}</strong>
            <span>Owner account</span>
          </div>
          <button type="button" className={styles.iconButton} aria-label="Account menu">···</button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>CONTENT CONTROL ROOM</p>
            <h1>{activeLabel}</h1>
          </div>
          <div className={styles.topbarActions}>
            <span className={styles.liveBadge}><i /> Site is live</span>
            <Link className={styles.viewSite} href="/" target="_blank">View site ↗</Link>
          </div>
        </header>

        <div className={styles.notice} role="status">
          <span>i</span>{notice}<button type="button" onClick={() => setNotice("Database adapter placeholder: connect this store to PostgreSQL or MySQL before deployment.")}>Database plan</button>
        </div>

        {activeView === "overview" && <Overview content={content} onNavigate={setActiveView} />}
        {activeView === "portfolio" && <Portfolio content={content} editingProject={editingProject} setEditingProject={setEditingProject} onSave={saveProject} onDelete={deleteProject} />}
        {activeView === "profile" && <Profile content={content} updateProfile={updateProfile} saveProfile={saveProfile} uploadProfileImage={uploadProfileImage} />}
        {activeView === "reviews" && <Reviews content={content} onAdd={addTestimonial} onRemove={removeTestimonial} onChange={updateTestimonial} onUploadImage={uploadTestimonialImage} onSave={saveTestimonials} />}
        {activeView === "services" && <Services content={content} persist={persist} />}
        {activeView === "inquiries" && <Inquiries content={content} onToggle={toggleInquiry} />}
        {activeView === "analytics" && <Analytics content={content} />}
        {activeView === "settings" && <><Settings content={content} persist={persist} /><PageCopyPanel content={content} persist={persist} /><ResumePanel resume={content.resume} uploadResume={uploadResume} /></>}
      </main>
    </div>
  );
}

function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (response.ok) window.location.reload();
    else {
      const result = await response.json().catch(() => null) as { error?: string } | null;
      const messages: Record<string, string> = {
        "username-invalid": "Username is Invalid",
        "password-invalid": "The password is invalid",
        "both-invalid": "Both are invalid",
      };
      setError(messages[result?.error ?? ""] ?? "Unable to sign in.");
    }
    setLoading(false);
  }

  return <main className={styles.loginPage}><form className={styles.loginCard} onSubmit={login}><span className={styles.adminMark}>MEHROZ / ADMIN</span><h1>Welcome back.</h1><p>Sign in to manage your portfolio.</p><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<span className={styles.passwordField}><input type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} /><button className={styles.passwordToggle} type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "◉" : "◌"}</button></span></label>{error && <p className={styles.loginError} role="alert">{error}</p>}<button className={styles.primaryButton} type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button><Link href="/">Back to portfolio</Link></form></main>;
}

function Overview({ content, onNavigate }: { content: AdminContent; onNavigate: (view: AdminView) => void }) {
  const cards = [
    { label: "Unique visitors", value: content.analytics.visitors.toLocaleString(), change: "+18.4%", tone: "orange" },
    { label: "Page views", value: content.analytics.pageViews.toLocaleString(), change: "+12.8%", tone: "dark" },
    { label: "Published projects", value: content.projects.filter((project) => project.status === "Published").length.toString(), change: `${content.projects.length} total`, tone: "light" },
    { label: "New inquiries", value: content.inquiries.filter((inquiry) => inquiry.status === "New").length.toString(), change: "Needs attention", tone: "cream" },
  ];
  return (
    <div className={styles.contentArea}>
      <section className={styles.welcomeRow}>
        <div><h2>Good morning, {content.profile.name}.</h2><p>Here is what is moving across your portfolio today.</p></div>
        <button className={styles.primaryButton} type="button" onClick={() => onNavigate("portfolio")}>Add project <span>+</span></button>
      </section>
      <section className={styles.metricGrid} aria-label="Portfolio metrics">
        {cards.map((card) => <article className={`${styles.metricCard} ${styles[card.tone]}`} key={card.label}><span>{card.label}</span><strong>{card.value}</strong><small>{card.change}</small></article>)}
      </section>
      <div className={styles.dashboardGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><p className={styles.panelKicker}>AUDIENCE</p><h2>Traffic overview</h2></div><button type="button" className={styles.selectButton}>Last 30 days⌄</button></div>
          <div className={styles.chart} aria-label="Traffic overview chart">{content.analytics.traffic.map((value, index) => <div className={styles.chartColumn} key={`${value}-${index}`}><div className={styles.chartBar} style={{ "--bar-height": `${value}%` } as BarStyle} /><span>{["01", "03", "06", "09", "12", "15", "18", "21", "24", "27", "29", "30"][index]}</span></div>)}</div>
          <div className={styles.chartLegend}><span><i className={styles.legendAccent} /> Visitors</span><strong>{content.analytics.visitors.toLocaleString()} <small>{content.analytics.visitors > 0 ? "Live" : "No data yet"}</small></strong></div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><p className={styles.panelKicker}>CONTENT</p><h2>Top pages</h2></div><button type="button" className={styles.moreButton} aria-label="More top page options">···</button></div>
          <div className={styles.topPages}>{content.analytics.topPages.map((page) => <div className={styles.topPage} key={page.page}><span>{page.page}</span><strong>{page.views.toLocaleString()}</strong><small>{page.change}</small></div>)}</div>
        </section>
      </div>
      <div className={styles.dashboardGrid}>
        <section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.panelKicker}>WORK</p><h2>Recent projects</h2></div><button type="button" className={styles.textButton} onClick={() => onNavigate("portfolio")}>Manage all →</button></div><div className={styles.recentList}>{content.projects.slice(0, 3).map((project) => <div className={styles.recentItem} key={project.id}><span className={`${styles.projectThumb} ${styles[project.media]}`} /><div><strong>{project.title}</strong><span>{project.category}</span></div><em className={project.status === "Published" ? styles.statusPublished : styles.statusDraft}>{project.status}</em><small>{project.updatedAt}</small></div>)}</div></section>
        <section className={`${styles.panel} ${styles.darkPanel}`}><p className={styles.panelKicker}>QUICK ACTIONS</p><h2>Keep the portfolio fresh.</h2><p>Update the story, add new work, and keep every public page current.</p><div className={styles.quickActions}><button type="button" onClick={() => onNavigate("profile")}>Update profile <span>→</span></button><button type="button" onClick={() => onNavigate("inquiries")}>Review inquiries <span>→</span></button><button type="button" onClick={() => onNavigate("settings")}>Site settings <span>→</span></button></div></section>
      </div>
    </div>
  );
}

function Portfolio({ content, editingProject, setEditingProject, onSave, onDelete }: { content: AdminContent; editingProject: AdminProject | null; setEditingProject: (project: AdminProject | null) => void; onSave: (event: FormEvent<HTMLFormElement>) => void; onDelete: (id: string) => void }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>PUBLIC WORK</p><h2>Portfolio projects</h2><p>These projects are ready to become database records later.</p></div><button className={styles.primaryButton} type="button" onClick={() => setEditingProject({ ...emptyProject })}>Add project <span>+</span></button></section><section className={styles.projectTable}><div className={styles.tableHeader}><span>Project</span><span>Category</span><span>Result</span><span>Status</span><span>Actions</span></div>{content.projects.map((project) => <div className={styles.tableRow} key={project.id}><div className={styles.projectCell}><span className={`${styles.projectThumb} ${styles[project.media]}`} /><div><strong>{project.title}</strong><small>{project.featured ? "Featured project" : "Standard project"}</small></div></div><span>{project.category}</span><strong>{project.metric}</strong><span><em className={project.status === "Published" ? styles.statusPublished : styles.statusDraft}>{project.status}</em></span><div className={styles.rowActions}><button type="button" onClick={() => setEditingProject({ ...project })}>Edit</button><button type="button" onClick={() => onDelete(project.id)}>Remove</button></div></div>)}</section>{editingProject && <div className={styles.modalBackdrop} role="presentation"><form className={styles.modal} onSubmit={onSave}><div className={styles.modalHeader}><div><p className={styles.panelKicker}>{editingProject.id ? "EDIT PROJECT" : "NEW PROJECT"}</p><h2>{editingProject.id ? editingProject.title : "Add a project"}</h2></div><button type="button" className={styles.closeButton} onClick={() => setEditingProject(null)} aria-label="Close">×</button></div><div className={styles.formGrid}><label>Project title<input required value={editingProject.title} onChange={(event) => setEditingProject({ ...editingProject, title: event.target.value })} /></label><label>Category<input required value={editingProject.category} onChange={(event) => setEditingProject({ ...editingProject, category: event.target.value })} /></label><label>Result metric<input required value={editingProject.metric} onChange={(event) => setEditingProject({ ...editingProject, metric: event.target.value })} /></label><label>Visual style<select value={editingProject.media} onChange={(event) => setEditingProject({ ...editingProject, media: event.target.value as AdminProject["media"] })}><option value="product">Product</option><option value="workspace">Workspace</option><option value="architecture">Architecture</option></select></label><label className={styles.fullField}>Description<textarea rows={4} value={editingProject.description} onChange={(event) => setEditingProject({ ...editingProject, description: event.target.value })} /></label><label className={styles.checkField}><input type="checkbox" checked={editingProject.featured} onChange={(event) => setEditingProject({ ...editingProject, featured: event.target.checked })} /> Featured on homepage</label><label>Status<select value={editingProject.status} onChange={(event) => setEditingProject({ ...editingProject, status: event.target.value as AdminProject["status"] })}><option>Published</option><option>Draft</option></select></label></div><div className={styles.modalFooter}><button type="button" className={styles.secondaryButton} onClick={() => setEditingProject(null)}>Cancel</button><button className={styles.primaryButton} type="submit">Save project</button></div></form></div>}</div>;
}

function Profile({ content, updateProfile, saveProfile, uploadProfileImage }: { content: AdminContent; updateProfile: (field: keyof AdminContent["profile"], value: string) => void; saveProfile: () => void; uploadProfileImage: (file: File | undefined) => void }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>IDENTITY</p><h2>Profile settings</h2><p>Update the person visitors meet on the public site.</p></div><button className={styles.primaryButton} type="button" onClick={saveProfile}>Save profile</button></section><section className={styles.editorPanel}><div className={styles.profilePreview}><div className={styles.avatarLarge}>{content.profile.imageUrl ? <Image src={content.profile.imageUrl} alt="Profile preview" width={170} height={170} unoptimized /> : <span>{content.profile.name.slice(0, 1)}</span>}</div><label className={styles.uploadButton}>Change picture<input type="file" accept="image/*" onChange={(event) => uploadProfileImage(event.target.files?.[0])} /></label><small>Images will use storage after database setup.</small></div><div className={styles.formGrid}><label>Name<input value={content.profile.name} onChange={(event) => updateProfile("name", event.target.value)} /></label><label>Role<input value={content.profile.role} onChange={(event) => updateProfile("role", event.target.value)} /></label><label className={styles.fullField}>Bio<textarea rows={4} value={content.profile.bio} onChange={(event) => updateProfile("bio", event.target.value)} /></label><label>Email<input type="email" value={content.profile.email} onChange={(event) => updateProfile("email", event.target.value)} /></label><label>Location<input value={content.profile.location} onChange={(event) => updateProfile("location", event.target.value)} /></label></div></section></div>;
}

function Reviews({ content, onAdd, onRemove, onChange, onUploadImage, onSave }: { content: AdminContent; onAdd: () => void; onRemove: (index: number) => void; onChange: (index: number, field: keyof AdminTestimonial, value: string) => void; onUploadImage: (index: number, file: File | undefined) => void; onSave: () => void }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>SOCIAL PROOF</p><h2>Customer reviews</h2><p>Manage the moving review cards shown on the homepage.</p></div><div className={styles.topbarActions}><button className={styles.secondaryButton} type="button" onClick={onAdd}>Add review <span>+</span></button><button className={styles.primaryButton} type="button" onClick={onSave}>Save reviews</button></div></section><div className={styles.reviewEditorList}>{content.testimonials.map((testimonial, index) => <article className={styles.reviewEditorCard} key={testimonial.id}><div className={styles.reviewEditorHeader}><div className={styles.avatarSmall}>{testimonial.imageUrl ? <Image src={testimonial.imageUrl} alt="Review customer preview" width={64} height={64} unoptimized /> : <span>{testimonial.name.slice(0, 1) || "?"}</span>}</div><label className={styles.uploadButton}>Change image<input type="file" accept="image/*" onChange={(event) => onUploadImage(index, event.target.files?.[0])} /></label><button className={styles.rowAction} type="button" onClick={() => onRemove(index)}>Remove</button></div><div className={styles.formGrid}><label>Name<input value={testimonial.name} onChange={(event) => onChange(index, "name", event.target.value)} /></label><label>Designation<input value={testimonial.role} onChange={(event) => onChange(index, "role", event.target.value)} /></label><label className={styles.fullField}>Review<textarea rows={4} value={testimonial.quote} onChange={(event) => onChange(index, "quote", event.target.value)} /></label></div></article>)}</div></div>;
}

function Services({ content, persist }: { content: AdminContent; persist: (content: AdminContent, message?: string) => void }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>OFFER</p><h2>Services</h2><p>Control which services appear on the public site.</p></div><button className={styles.primaryButton} type="button" onClick={() => persist({ ...content, services: [...content.services, { id: crypto.randomUUID(), title: "New service", description: "Describe this service.", visible: true }] }, "Service added locally")}>Add service <span>+</span></button></section><section className={styles.serviceEditor}>{content.services.map((service) => <div className={styles.serviceEditorRow} key={service.id}><span className={styles.dragHandle}>⠿</span><div><input value={service.title} onChange={(event) => persist({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, title: event.target.value } : item) })} /><textarea rows={2} value={service.description} onChange={(event) => persist({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, description: event.target.value } : item) })} /></div><label className={styles.switch}><input type="checkbox" checked={service.visible} onChange={(event) => persist({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, visible: event.target.checked } : item) })} /><span /></label><button type="button" className={styles.rowAction} onClick={() => persist(content, "Service saved to PostgreSQL")}>Save service</button></div>)}</section></div>;
}

function Inquiries({ content, onToggle }: { content: AdminContent; onToggle: (id: string) => void }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>INBOX</p><h2>Inquiries</h2><p>Messages collected from the contact form.</p></div><span className={styles.filterPill}>All messages⌄</span></section><section className={styles.inquiryList}>{content.inquiries.map((inquiry) => <article className={styles.inquiryRow} key={inquiry.id}><div className={styles.inquiryAvatar}>{inquiry.name.slice(0, 1)}</div><div className={styles.inquiryMain}><div><strong>{inquiry.name}</strong><span>{inquiry.company}</span></div><p>{inquiry.subject}</p><small>{inquiry.email} · {inquiry.receivedAt}</small></div><em className={inquiry.status === "New" ? styles.statusNew : styles.statusRead}>{inquiry.status}</em><button type="button" className={styles.rowAction} onClick={() => onToggle(inquiry.id)}>{inquiry.status === "New" ? "Mark read" : "View"} →</button></article>)}</section></div>;
}

function Analytics({ content }: { content: AdminContent }) {
  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>MEASUREMENT</p><h2>Analytics</h2><p>A place for privacy-aware traffic and conversion reporting.</p></div><span className={styles.filterPill}>Last 30 days⌄</span></section><section className={styles.metricGrid}>{[{ label: "Visitors", value: content.analytics.visitors.toLocaleString(), change: "+18.4%" }, { label: "Page views", value: content.analytics.pageViews.toLocaleString(), change: "+12.8%" }, { label: "Inquiries", value: content.analytics.inquiries.toString(), change: "+21.0%" }, { label: "Resume requests", value: content.analytics.resumeRequests.toString(), change: "+9.2%" }].map((metric) => <article className={`${styles.metricCard} ${styles.analyticsMetric}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.change}</small></article>)}</section><section className={styles.panel}><div className={styles.panelHeading}><div><p className={styles.panelKicker}>PERFORMANCE</p><h2>Top pages</h2></div></div><div className={styles.topPages}>{content.analytics.topPages.map((page) => <div className={styles.topPage} key={page.page}><span>{page.page}</span><strong>{page.views.toLocaleString()} views</strong><small>{page.change}</small></div>)}</div></section><p className={styles.integrationHint}>Database integration placeholder: connect page-view events to a server-side analytics table, then replace this demo dataset with aggregated queries.</p></div>;
}

function ResumePanel({ resume, uploadResume }: { resume: AdminContent["resume"]; uploadResume: (file: File | undefined) => void }) {
  return <section className={styles.databasePanel}><p className={styles.panelKicker}>RESUME PDF</p><h2>{resume ? resume.fileName : "Upload your current CV"}</h2><p>{resume ? `Updated ${new Date(resume.updatedAt).toLocaleString()} · ${(resume.fileSize / 1024 / 1024).toFixed(2)} MB` : "Upload a PDF so visitors can download the latest version."}</p><label className={styles.uploadButton}>Upload PDF<input type="file" accept="application/pdf,.pdf" onChange={(event) => uploadResume(event.target.files?.[0])} /></label>{resume && <a href="/api/resume/download" target="_blank" rel="noreferrer">Download current CV</a>}</section>;
}

function PageCopyPanel({ content, persist }: { content: AdminContent; persist: (content: AdminContent, message?: string) => void }) {
  const update = (field: keyof AdminContent["settings"], value: string) => persist({ ...content, settings: { ...content.settings, [field]: value } }, "Page copy saved to PostgreSQL");
  return <section className={styles.databasePanel}><p className={styles.panelKicker}>PUBLIC PAGE COPY</p><h2>Contact and page descriptions</h2><div className={styles.settingsPanel}><label>Contact page title<input value={content.settings.contactTitle} onChange={(event) => update("contactTitle", event.target.value)} /></label><label>Contact page description<textarea rows={3} value={content.settings.contactIntro} onChange={(event) => update("contactIntro", event.target.value)} /></label><label>Contact response time<input value={content.settings.contactResponseTime} onChange={(event) => update("contactResponseTime", event.target.value)} /></label><label>Contact location<input value={content.settings.contactLocation} onChange={(event) => update("contactLocation", event.target.value)} /></label><label>About page description<textarea rows={3} value={content.settings.aboutIntro} onChange={(event) => update("aboutIntro", event.target.value)} /></label><label>About page detail<textarea rows={3} value={content.settings.aboutDetail} onChange={(event) => update("aboutDetail", event.target.value)} /></label><label>About page proof<textarea rows={3} value={content.settings.aboutProof} onChange={(event) => update("aboutProof", event.target.value)} /></label><label>Services page description<textarea rows={3} value={content.settings.servicesIntro} onChange={(event) => update("servicesIntro", event.target.value)} /></label><label>Portfolio page description<textarea rows={3} value={content.settings.portfolioIntro} onChange={(event) => update("portfolioIntro", event.target.value)} /></label><label>Case studies description<textarea rows={3} value={content.settings.caseStudiesIntro} onChange={(event) => update("caseStudiesIntro", event.target.value)} /></label><label>Experience page description<textarea rows={3} value={content.settings.experienceIntro} onChange={(event) => update("experienceIntro", event.target.value)} /></label></div></section>;
}

function Settings({ content, persist }: { content: AdminContent; persist: (content: AdminContent, message?: string) => void }) {
  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) window.location.reload();
  }

  return <div className={styles.contentArea}><section className={styles.sectionIntro}><div><p className={styles.panelKicker}>CONFIGURATION</p><h2>Site settings</h2><p>Search, contact, publishing, and analytics controls.</p></div><span className={styles.savedMark}>Saved locally ✓</span></section><section className={styles.settingsPanel}><label>Site title<input value={content.settings.siteTitle} onChange={(event) => persist({ ...content, settings: { ...content.settings, siteTitle: event.target.value } })} /></label><label>Site description<textarea rows={4} value={content.settings.siteDescription} onChange={(event) => persist({ ...content, settings: { ...content.settings, siteDescription: event.target.value } })} /></label><label>Contact email<input type="email" value={content.settings.contactEmail} onChange={(event) => persist({ ...content, settings: { ...content.settings, contactEmail: event.target.value } })} /></label><div className={styles.settingToggle}><div><strong>Analytics collection</strong><span>Allow the future analytics adapter to record anonymous visits.</span></div><label className={styles.switch}><input type="checkbox" checked={content.settings.analyticsEnabled} onChange={(event) => persist({ ...content, settings: { ...content.settings, analyticsEnabled: event.target.checked } })} /><span /></label></div><div className={styles.settingToggle}><div><strong>Maintenance mode</strong><span>Hide public content while a release is in progress.</span></div><label className={styles.switch}><input type="checkbox" checked={content.settings.maintenanceMode} onChange={(event) => persist({ ...content, settings: { ...content.settings, maintenanceMode: event.target.checked } })} /><span /></label></div></section><section className={styles.databasePanel}><p className={styles.panelKicker}>FUTURE CONNECTION</p><h2>Ready for PostgreSQL or MySQL</h2><p>The admin UI is already separated from persistence. Add API routes and replace the browser storage adapter with a server-side repository using your preferred SQL driver.</p><div className={styles.databaseTags}><span>Content tables</span><span>Media storage</span><span>Admin auth</span><span>Analytics events</span></div><button type="button" className={styles.secondaryButton} onClick={logout}>Log out</button></section></div>;
}
