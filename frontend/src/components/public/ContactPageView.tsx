"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteSettings } from "@/lib/types";

export type ContactFormState = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  extra_fields?: Array<{
    field_id: string;
    label: string;
    value: string;
  }>;
};

type ContactPageViewProps = {
  settings: SiteSettings | null;
  interactive?: boolean;
  onSubmitRequest?: (formData: ContactFormState) => Promise<void>;
};

type CustomFormField = SiteSettings["contact_page"]["form_panel"]["custom_fields"][number];

type RenderableField = {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  width: "half" | "full";
  options: string[];
  isCustom: boolean;
};

const fallbackContactPage = {
  left_panel: {
    badge_text: "Connect",
    title_prefix: "Start your",
    title_highlight: "journey.",
    description:
      "Our admissions team is available to assist you with program selection, enrollment, and academic counseling.",
    campus_title: "Our Campus",
    phone_title: "Direct Line",
    email_title: "Electronic Mail",
    website_title: "Website",
    website_link_text: "Visit official website",
    hours_title: "Operating Hours",
    visible_items: {
      campus: true,
      phone: true,
      email: true,
      website: true,
      hours: true,
    },
  },
  form_panel: {
    title: "Send Inquiry",
    subtitle: "We aim to respond within 24 hours.",
    name_label: "Full Name *",
    name_placeholder: "e.g. Ram Sharma",
    email_label: "Email Address *",
    email_placeholder: "you@domain.com",
    phone_label: "Phone Number",
    phone_placeholder: "+977 98XXXXXXXX",
    message_label: "How can we help? *",
    message_placeholder:
      "Tell us about your educational background and what you're looking for...",
    submit_label: "Submit Inquiry",
    submitting_label: "Transmitting...",
    success_message: "Message dispatched. A counselor will reach out soon.",
    error_message: "Failed to transmit. Please verify your connection.",
    field_visibility: {
      email: true,
      phone: true,
    },
    custom_fields: [] as CustomFormField[],
  },
  form_styles: {
    panel_background: "#ffffff",
    title_color: "#0f172a",
    title_size: "32px",
    title_font_family: "serif" as const,
    title_font_style: "normal" as const,
    subtitle_color: "#64748b",
    subtitle_size: "16px",
    subtitle_font_style: "normal" as const,
    label_color: "#94a3b8",
    label_size: "10px",
    label_font_style: "normal" as const,
    input_background: "#f8fafc",
    input_border_color: "#e2e8f0",
    input_text_color: "#0f172a",
    input_placeholder_color: "#cbd5e1",
    input_font_size: "16px",
    input_font_style: "normal" as const,
    button_background: "#0f172a",
    button_hover_background: "#3b82f6",
    button_text_color: "#ffffff",
    button_font_size: "18px",
    button_font_family: "sans" as const,
    button_font_style: "normal" as const,
  },
  map_section: {
    title: "Visit us on the map",
    description: "Use the map below to find our campus quickly.",
  },
};

function pickFontFamily(value: "serif" | "sans" | undefined) {
  return value === "serif" ? "var(--font-serif)" : "var(--font-sans)";
}

export default function ContactPageView({
  settings,
  interactive = true,
  onSubmitRequest,
}: ContactPageViewProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const contactInfo = settings?.contact_info;
  const contactPage = settings?.contact_page;
  const leftPanel = {
    ...fallbackContactPage.left_panel,
    ...(contactPage?.left_panel || {}),
    visible_items: {
      ...fallbackContactPage.left_panel.visible_items,
      ...(contactPage?.left_panel?.visible_items || {}),
    },
  };
  const formPanel = {
    ...fallbackContactPage.form_panel,
    ...(contactPage?.form_panel || {}),
    field_visibility: {
      ...fallbackContactPage.form_panel.field_visibility,
      ...(contactPage?.form_panel?.field_visibility || {}),
    },
    custom_fields: Array.isArray(contactPage?.form_panel?.custom_fields)
      ? contactPage.form_panel.custom_fields
      : fallbackContactPage.form_panel.custom_fields,
  };
  const formStyles = {
    ...fallbackContactPage.form_styles,
    ...(contactPage?.form_styles || {}),
  };
  const mapSection = {
    ...fallbackContactPage.map_section,
    ...(contactPage?.map_section || {}),
  };

  const renderableFields = useMemo<RenderableField[]>(() => {
    const baseFields: RenderableField[] = [
      {
        key: "name",
        label: formPanel.name_label,
        placeholder: formPanel.name_placeholder,
        type: "text",
        required: true,
        width: "half",
        options: [],
        isCustom: false,
      },
      {
        key: "email",
        label: formPanel.email_label,
        placeholder: formPanel.email_placeholder,
        type: "email",
        required: true,
        width: "half",
        options: [],
        isCustom: false,
      },
      {
        key: "phone",
        label: formPanel.phone_label,
        placeholder: formPanel.phone_placeholder,
        type: "tel",
        required: false,
        width: "full",
        options: [],
        isCustom: false,
      },
      {
        key: "message",
        label: formPanel.message_label,
        placeholder: formPanel.message_placeholder,
        type: "textarea",
        required: true,
        width: "full",
        options: [],
        isCustom: false,
      },
    ];

    const visibleBaseFields = baseFields.filter((field) => {
      if (field.key === "email") return formPanel.field_visibility.email;
      if (field.key === "phone") return formPanel.field_visibility.phone;
      return true;
    });

    const visibleCustomFields = formPanel.custom_fields
      .filter((field) => field.is_visible)
      .map<RenderableField>((field) => ({
        key: field.id,
        label: field.label,
        placeholder: field.placeholder,
        type: field.type,
        required: field.required,
        width: field.type === "textarea" ? "full" : field.width,
        options: field.options,
        isCustom: true,
      }));

    return [...visibleBaseFields, ...visibleCustomFields];
  }, [formPanel]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmitRequest) return;

    setStatus("submitting");
    try {
      await onSubmitRequest({
        name: formValues.name,
        email: formPanel.field_visibility.email ? formValues.email || undefined : undefined,
        phone: formPanel.field_visibility.phone ? formValues.phone || undefined : undefined,
        message: formValues.message,
        extra_fields: renderableFields
          .filter((field) => field.isCustom)
          .map((field) => ({
            field_id: field.key,
            label: field.label,
            value: formValues[field.key] || "",
          }))
          .filter((field) => field.value.trim().length > 0),
      });
      setStatus("success");
      setFormValues({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const panelStyle = {
    background: formStyles.panel_background,
    "--contact-input-placeholder": formStyles.input_placeholder_color,
    "--contact-button-hover": formStyles.button_hover_background,
  } as CSSProperties;

  const titleStyle = {
    color: formStyles.title_color,
    fontSize: formStyles.title_size,
    fontStyle: formStyles.title_font_style,
    fontFamily: pickFontFamily(formStyles.title_font_family),
  } as CSSProperties;

  const subtitleStyle = {
    color: formStyles.subtitle_color,
    fontSize: formStyles.subtitle_size,
    fontStyle: formStyles.subtitle_font_style,
  } as CSSProperties;

  const labelStyle = {
    color: formStyles.label_color,
    fontSize: formStyles.label_size,
    fontStyle: formStyles.label_font_style,
  } as CSSProperties;

  const fieldStyle = {
    background: formStyles.input_background,
    borderColor: formStyles.input_border_color,
    color: formStyles.input_text_color,
    fontSize: formStyles.input_font_size,
    fontStyle: formStyles.input_font_style,
  } as CSSProperties;

  const buttonTextStyle = {
    color: formStyles.button_text_color,
    fontSize: formStyles.button_font_size,
    fontStyle: formStyles.button_font_style,
    fontFamily: pickFontFamily(formStyles.button_font_family),
  } as CSSProperties;

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-slate-900 ${interactive ? "" : "pointer-events-none select-none"}`}
    >
      <div className="absolute inset-0 z-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg')] bg-cover bg-center opacity-[0.05] mix-blend-overlay" />
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-20 mix-blend-screen blur-[120px]"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[800px] w-[800px] rounded-full opacity-10 mix-blend-screen blur-[150px]"
        style={{ background: "var(--color-accent)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-16 pt-32">
        <div className="grid w-full overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] lg:grid-cols-12">
          <ContactInfoPanel settings={settings} />

          <div
            id="contact-form-panel"
            data-preview-section="contact-form-panel"
            className="contact-form-panel relative lg:col-span-7"
            style={panelStyle}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex h-full flex-col justify-center p-12 md:p-16"
            >
              <div className="mb-10">
                <h2 className="text-balance font-black leading-tight" style={titleStyle}>
                  {formPanel.title}
                </h2>
                {formPanel.subtitle ? (
                  <p className="mt-3 max-w-2xl leading-relaxed" style={subtitleStyle}>
                    {formPanel.subtitle}
                  </p>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {renderableFields.map((field) => (
                    <ContactField
                      key={field.key}
                      label={field.label}
                      value={formValues[field.key] || ""}
                      onChange={(value) =>
                        setFormValues((current) => ({ ...current, [field.key]: value }))
                      }
                      placeholder={field.placeholder}
                      type={field.type}
                      required={field.required}
                      disabled={!interactive || status === "submitting"}
                      labelStyle={labelStyle}
                      fieldStyle={fieldStyle}
                      options={field.options}
                      wrapperClassName={field.width === "full" ? "md:col-span-2" : ""}
                    />
                  ))}

                  <AnimatePresence>
                    {status === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 font-medium text-green-700 md:col-span-2"
                      >
                        {formPanel.success_message}
                      </motion.div>
                    ) : null}
                    {status === "error" ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-700 md:col-span-2"
                      >
                        {formPanel.error_message}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="md:col-span-2">
                    <button
                      disabled={!interactive || status === "submitting"}
                      type="submit"
                      className="group/submit relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-5 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] disabled:opacity-50"
                      style={{ background: formStyles.button_background }}
                    >
                      <div
                        className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover/submit:translate-y-0"
                        style={{ background: "var(--contact-button-hover)" }}
                      />
                      <span
                        className="relative z-10 flex items-center gap-2 font-bold"
                        style={buttonTextStyle}
                      >
                        {status === "submitting" ? (
                          formPanel.submitting_label
                        ) : (
                          <>
                            {formPanel.submit_label} <Send className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <div data-preview-section="contact-map-section" className="sr-only" />
      {contactInfo?.map_embed ? (
        <section
          id="contact-map-section"
          data-preview-section="contact-map-section"
          className="relative z-10 mx-auto max-w-7xl px-6 pb-24"
        >
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                  Contact map
                </p>
                <h2 className="mt-2 text-2xl font-serif font-bold text-white md:text-3xl">
                  {mapSection.title}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                {mapSection.description}
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/20">
              <iframe
                src={contactInfo.map_embed}
                className="h-[380px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Institution map"
              />
            </div>
          </div>
        </section>
      ) : null}

      <style jsx>{`
        .contact-form-panel :global(input.contact-form-field::placeholder),
        .contact-form-panel :global(textarea.contact-form-field::placeholder),
        .contact-form-panel :global(select.contact-form-field:invalid) {
          color: var(--contact-input-placeholder);
        }
      `}</style>
    </div>
  );
}

export function ContactInfoPanel({ settings }: { settings: SiteSettings | null }) {
  const contactInfo = settings?.contact_info;
  const leftPanel = {
    ...fallbackContactPage.left_panel,
    ...(settings?.contact_page?.left_panel || {}),
    visible_items: {
      ...fallbackContactPage.left_panel.visible_items,
      ...(settings?.contact_page?.left_panel?.visible_items || {}),
    },
  };

  return (
    <div
      id="contact-left-panel"
      data-preview-section="contact-left-panel"
      className="relative overflow-hidden p-12 backdrop-blur-2xl md:p-16 lg:col-span-5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          {leftPanel.badge_text}
        </span>
        <h1
          className="mb-6 text-4xl font-black tracking-tight text-white md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {leftPanel.title_prefix} <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(to right, white, var(--color-accent))" }}
          >
            {leftPanel.title_highlight}
          </span>
        </h1>
        <p className="mb-12 text-lg font-light leading-relaxed text-slate-300">
          {leftPanel.description}
        </p>

        <div className="flex-1 space-y-8">
          {leftPanel.visible_items.campus ? (
            <ContactInfoItem
              icon={MapPin}
              title={leftPanel.campus_title}
              value={contactInfo?.address || "123 Education Lane"}
            />
          ) : null}

          {leftPanel.visible_items.phone ? (
            <ContactInfoItem
              icon={Phone}
              title={leftPanel.phone_title}
              value={contactInfo?.phone?.[0] || "(555) 123-4567"}
              accent
            />
          ) : null}

          {leftPanel.visible_items.email ? (
            <ContactInfoItem
              icon={Mail}
              title={leftPanel.email_title}
              value={contactInfo?.email || "admissions@tuitionhub.edu"}
              accent
            />
          ) : null}

          {leftPanel.visible_items.website && contactInfo?.website ? (
            <div className="flex items-start gap-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
                style={{ color: "var(--color-accent)" }}
              >
                <ArrowRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-white">{leftPanel.website_title}</h3>
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  {leftPanel.website_link_text} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : null}

          {leftPanel.visible_items.hours && contactInfo?.hours ? (
            <ContactInfoItem icon={Clock} title={leftPanel.hours_title} value={contactInfo.hours} />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function ContactInfoItem({
  icon: Icon,
  title,
  value,
  accent = false,
}: {
  icon: typeof MapPin;
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
        style={{ color: accent ? "var(--color-accent)" : undefined }}
      >
        <Icon className={!accent ? "text-white" : undefined} />
      </div>
      <div>
        <h3 className="mb-1 font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{value}</p>
      </div>
    </div>
  );
}

function ContactField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  labelStyle,
  fieldStyle,
  options = [],
  wrapperClassName = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  disabled?: boolean;
  labelStyle: CSSProperties;
  fieldStyle: CSSProperties;
  options?: string[];
  wrapperClassName?: string;
}) {
  const baseClassName =
    "contact-form-field w-full rounded-2xl border p-4 font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div className={`group ${wrapperClassName}`}>
      <label
        className="mb-2 block font-bold uppercase tracking-widest transition-colors"
        style={labelStyle}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${baseClassName} min-h-[160px] resize-none`}
          placeholder={placeholder}
          disabled={disabled}
          style={fieldStyle}
        />
      ) : type === "select" ? (
        <select
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={baseClassName}
          disabled={disabled}
          style={fieldStyle}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={baseClassName}
          placeholder={placeholder}
          disabled={disabled}
          style={fieldStyle}
        />
      )}
    </div>
  );
}
