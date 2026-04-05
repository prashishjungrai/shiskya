"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  ListPlus,
  Map,
  MessageSquareText,
  Palette,
  PhoneCall,
  Rows3,
  Trash2,
  Type,
} from "lucide-react";
import api from "@/lib/api";
import PublicPagePreview from "@/components/admin/PublicPagePreview";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import ContactPageView from "@/components/public/ContactPageView";
import {
  ColorField,
  EditorPanel,
  PublicPreviewLink,
  PublishingToolbar,
  SaveButton,
  SelectField,
  ShortcutCard,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorToolkit";
import { PreviewSyncProvider } from "@/components/admin/PreviewSyncContext";
import useSiteSettingsEditor from "@/lib/use-site-settings-editor";
import { ContactSubmission, SiteSettings } from "@/lib/types";

type InquirySummary = {
  total: number;
  unread: number;
};

type CustomFormField = SiteSettings["contact_page"]["form_panel"]["custom_fields"][number];

const fontFamilyOptions = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
];

const fontStyleOptions = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
];

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const fieldTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "tel" },
  { label: "Textarea", value: "textarea" },
  { label: "Select", value: "select" },
];

const widthOptions = [
  { label: "Half Width", value: "half" },
  { label: "Full Width", value: "full" },
];

function createCustomField(type: CustomFormField["type"]): CustomFormField {
  return {
    id: crypto.randomUUID(),
    label: "New field",
    placeholder: type === "select" ? "Choose an option" : "Type here",
    type,
    required: false,
    is_visible: true,
    width: type === "textarea" ? "full" : "half",
    options: type === "select" ? ["Option 1", "Option 2"] : [],
  };
}

function SectionMarker({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof PhoneCall;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4 rounded-[24px] border border-primary/5 bg-primary/[0.02] p-5">
      <div className="rounded-2xl bg-primary/5 p-3 text-primary/65">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
          Contact Editor
        </p>
        <h4 className="mt-2 text-lg font-serif font-bold text-primary">{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-primary/45">{description}</p>
      </div>
    </div>
  );
}

export default function ContactEditorPage() {
  const {
    settings,
    setSettings,
    loading,
    saving,
    publishing,
    discarding,
    hasUnpublishedChanges,
    lastPublishedAt,
    revisionCount,
    saveSettings,
    publishSettings,
    discardDraft,
    updateNested,
  } = useSiteSettingsEditor();
  const [summary, setSummary] = useState<InquirySummary>({ total: 0, unread: 0 });

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const response = await api.get("/admin/contacts");
        const items = response.data as ContactSubmission[];
        setSummary({
          total: items.length,
          unread: items.filter((item) => !item.is_read).length,
        });
      } catch (error) {
        console.error("Failed to load inquiry summary", error);
      }
    };

    void loadInquiries();
  }, []);

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const contactInfo = settings.contact_info;
  const contactPage = settings.contact_page;
  const leftPanel = contactPage.left_panel;
  const formPanel = contactPage.form_panel;
  const formStyles = contactPage.form_styles;
  const mapSection = contactPage.map_section;
  const visibleItems = leftPanel.visible_items;
  const fieldVisibility = formPanel.field_visibility;

  const saveDraftSection = async (successTitle: string, successDescription: string) => {
    await saveSettings({
      successTitle,
      successDescription,
    });
  };

  const updateCustomField = (
    fieldId: string,
    updates: Partial<CustomFormField>,
  ) => {
    setSettings((current) => {
      if (!current) return current;

      return {
        ...current,
        contact_page: {
          ...current.contact_page,
          form_panel: {
            ...current.contact_page.form_panel,
            custom_fields: current.contact_page.form_panel.custom_fields.map((field) =>
              field.id === fieldId ? { ...field, ...updates } : field,
            ),
          },
        },
      };
    });
  };

  const addCustomField = (type: CustomFormField["type"]) => {
    setSettings((current) => {
      if (!current) return current;

      return {
        ...current,
        contact_page: {
          ...current.contact_page,
          form_panel: {
            ...current.contact_page.form_panel,
            custom_fields: [
              ...current.contact_page.form_panel.custom_fields,
              createCustomField(type),
            ],
          },
        },
      };
    });
  };

  const removeCustomField = (fieldId: string) => {
    setSettings((current) => {
      if (!current) return current;

      return {
        ...current,
        contact_page: {
          ...current.contact_page,
          form_panel: {
            ...current.contact_page.form_panel,
            custom_fields: current.contact_page.form_panel.custom_fields.filter(
              (field) => field.id !== fieldId,
            ),
          },
        },
      };
    });
  };

  return (
    <PreviewSyncProvider>
      <div className="space-y-10">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
            Public Page Editor
          </p>
          <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-primary">
            Contact Page
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
            Control both sides of the contact layout from here: the left-hand admissions panel,
            the full inquiry form on the right, and the optional map section below it.
          </p>
        </div>
        <PublicPreviewLink href="/contact" label="Preview contact page" />
      </header>

      <PublishingToolbar
        hasUnpublishedChanges={hasUnpublishedChanges}
        lastPublishedAt={lastPublishedAt}
        draftUpdatedAt={settings.updated_at}
        revisionCount={revisionCount}
        publishing={publishing}
        discarding={discarding}
        onPublish={publishSettings}
        onDiscard={discardDraft}
      />

      <div className="grid gap-8 2xl:grid-cols-[minmax(28rem,0.92fr)_minmax(50rem,1.08fr)]">
        <div className="space-y-8">
          <EditorPanel
            previewTarget="contact-left-panel"
            title="Contact Details"
            description="These values power the campus, phone, email, website, and hours cards on the left side of the public contact page."
          >
            <SectionMarker
              icon={PhoneCall}
              title="Left-side contact cards"
              description="This replaces the old limited editor. Address, phone, website, office hours, and the card labels now live in one place."
            />

            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Contact details saved",
                  "The contact-card values are saved to draft. Publish when you want them live.",
                );
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Email"
                  type="email"
                  value={contactInfo?.email || ""}
                  onChange={(value) => updateNested("contact_info.email", value)}
                  placeholder="admissions@example.com"
                />
                <TextField
                  label="Primary Phone"
                  value={contactInfo?.phone?.[0] || ""}
                  onChange={(value) => updateNested("contact_info.phone", [value])}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              <TextField
                label="Address"
                value={contactInfo?.address || ""}
                onChange={(value) => updateNested("contact_info.address", value)}
                placeholder="Your institution address"
              />

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Office Hours"
                  value={contactInfo?.hours || ""}
                  onChange={(value) => updateNested("contact_info.hours", value)}
                  placeholder="Sun-Fri 6AM-6PM"
                />
                <TextField
                  label="Website"
                  type="url"
                  value={contactInfo?.website || ""}
                  onChange={(value) => updateNested("contact_info.website", value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <h4 className="text-lg font-serif font-bold text-primary">
                  Visible contact elements
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-primary/45">
                  Choose which left-side contact cards are displayed on the public page.
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <SelectField
                    label="Show Campus Card"
                    value={visibleItems.campus ? "true" : "false"}
                    onChange={(value) =>
                      updateNested(
                        "contact_page.left_panel.visible_items.campus",
                        value === "true",
                      )
                    }
                    options={booleanOptions}
                  />
                  <SelectField
                    label="Show Phone Card"
                    value={visibleItems.phone ? "true" : "false"}
                    onChange={(value) =>
                      updateNested(
                        "contact_page.left_panel.visible_items.phone",
                        value === "true",
                      )
                    }
                    options={booleanOptions}
                  />
                  <SelectField
                    label="Show Email Card"
                    value={visibleItems.email ? "true" : "false"}
                    onChange={(value) =>
                      updateNested(
                        "contact_page.left_panel.visible_items.email",
                        value === "true",
                      )
                    }
                    options={booleanOptions}
                  />
                  <SelectField
                    label="Show Website Card"
                    value={visibleItems.website ? "true" : "false"}
                    onChange={(value) =>
                      updateNested(
                        "contact_page.left_panel.visible_items.website",
                        value === "true",
                      )
                    }
                    options={booleanOptions}
                  />
                  <SelectField
                    label="Show Hours Card"
                    value={visibleItems.hours ? "true" : "false"}
                    onChange={(value) =>
                      updateNested(
                        "contact_page.left_panel.visible_items.hours",
                        value === "true",
                      )
                    }
                    options={booleanOptions}
                  />
                </div>
              </div>

              <SaveButton saving={saving} label="Save contact details" />
            </form>
          </EditorPanel>

          <EditorPanel
            previewTarget="contact-left-panel"
            title="Left Panel Copy"
            description="Edit the story section on the left: badge, headline, description, and the contact-card headings."
          >
            <SectionMarker
              icon={Type}
              title="Admissions narrative"
              description="The left side should not be half-hardcoded. Badge text, headline split, description, and each card heading are editable here."
            />

            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Left panel copy saved",
                  "The admissions-side copy is saved to draft and visible in preview.",
                );
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Badge Text"
                  value={leftPanel.badge_text}
                  onChange={(value) => updateNested("contact_page.left_panel.badge_text", value)}
                  placeholder="Connect"
                />
                <TextField
                  label="Highlighted Headline"
                  value={leftPanel.title_highlight}
                  onChange={(value) =>
                    updateNested("contact_page.left_panel.title_highlight", value)
                  }
                  placeholder="journey."
                />
              </div>

              <TextField
                label="Headline Prefix"
                value={leftPanel.title_prefix}
                onChange={(value) => updateNested("contact_page.left_panel.title_prefix", value)}
                placeholder="Start your"
              />

              <TextAreaField
                label="Description"
                value={leftPanel.description}
                onChange={(value) => updateNested("contact_page.left_panel.description", value)}
                placeholder="Explain how the admissions team helps visitors."
                rows={4}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Campus Card Title"
                  value={leftPanel.campus_title}
                  onChange={(value) => updateNested("contact_page.left_panel.campus_title", value)}
                  placeholder="Our Campus"
                />
                <TextField
                  label="Phone Card Title"
                  value={leftPanel.phone_title}
                  onChange={(value) => updateNested("contact_page.left_panel.phone_title", value)}
                  placeholder="Direct Line"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Email Card Title"
                  value={leftPanel.email_title}
                  onChange={(value) => updateNested("contact_page.left_panel.email_title", value)}
                  placeholder="Electronic Mail"
                />
                <TextField
                  label="Website Card Title"
                  value={leftPanel.website_title}
                  onChange={(value) =>
                    updateNested("contact_page.left_panel.website_title", value)
                  }
                  placeholder="Website"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Website Link Text"
                  value={leftPanel.website_link_text}
                  onChange={(value) =>
                    updateNested("contact_page.left_panel.website_link_text", value)
                  }
                  placeholder="Visit official website"
                />
                <TextField
                  label="Hours Card Title"
                  value={leftPanel.hours_title}
                  onChange={(value) => updateNested("contact_page.left_panel.hours_title", value)}
                  placeholder="Operating Hours"
                />
              </div>

              <SaveButton saving={saving} label="Save left panel copy" />
            </form>
          </EditorPanel>

          <EditorPanel
            previewTarget="contact-form-panel"
            title="Inquiry Form Copy"
            description="Everything on the right panel is editable here, including the form headings, every label, every placeholder, and the submit/status messages."
          >
            <SectionMarker
              icon={MessageSquareText}
              title="Right-side form content"
              description="This is the gap that was missing in admin. The full public inquiry form is now controlled from here instead of being locked in code."
            />

            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Inquiry form copy saved",
                  "The right-side contact form copy is saved to draft and visible in preview.",
                );
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Form Title"
                  value={formPanel.title}
                  onChange={(value) => updateNested("contact_page.form_panel.title", value)}
                  placeholder="Send Inquiry"
                />
                <TextField
                  label="Form Subtitle"
                  value={formPanel.subtitle}
                  onChange={(value) => updateNested("contact_page.form_panel.subtitle", value)}
                  placeholder="We aim to respond within 24 hours."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Name Label"
                  value={formPanel.name_label}
                  onChange={(value) => updateNested("contact_page.form_panel.name_label", value)}
                  placeholder="Full Name *"
                />
                <TextField
                  label="Name Placeholder"
                  value={formPanel.name_placeholder}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.name_placeholder", value)
                  }
                  placeholder="e.g. Ram Sharma"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Email Label"
                  value={formPanel.email_label}
                  onChange={(value) => updateNested("contact_page.form_panel.email_label", value)}
                  placeholder="Email Address *"
                />
                <TextField
                  label="Email Placeholder"
                  value={formPanel.email_placeholder}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.email_placeholder", value)
                  }
                  placeholder="you@domain.com"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Phone Label"
                  value={formPanel.phone_label}
                  onChange={(value) => updateNested("contact_page.form_panel.phone_label", value)}
                  placeholder="Phone Number"
                />
                <TextField
                  label="Phone Placeholder"
                  value={formPanel.phone_placeholder}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.phone_placeholder", value)
                  }
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Message Label"
                  value={formPanel.message_label}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.message_label", value)
                  }
                  placeholder="How can we help? *"
                />
                <TextAreaField
                  label="Message Placeholder"
                  value={formPanel.message_placeholder}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.message_placeholder", value)
                  }
                  placeholder="Tell us about your educational background and what you're looking for..."
                  rows={4}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Submit Button Label"
                  value={formPanel.submit_label}
                  onChange={(value) => updateNested("contact_page.form_panel.submit_label", value)}
                  placeholder="Submit Inquiry"
                />
                <TextField
                  label="Submitting Label"
                  value={formPanel.submitting_label}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.submitting_label", value)
                  }
                  placeholder="Transmitting..."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <TextAreaField
                  label="Success Message"
                  value={formPanel.success_message}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.success_message", value)
                  }
                  placeholder="Message dispatched. A counselor will reach out soon."
                  rows={3}
                />
                <TextAreaField
                  label="Error Message"
                  value={formPanel.error_message}
                  onChange={(value) =>
                    updateNested("contact_page.form_panel.error_message", value)
                  }
                  placeholder="Failed to transmit. Please verify your connection."
                  rows={3}
                />
              </div>

              <SaveButton saving={saving} label="Save inquiry form copy" />
            </form>
          </EditorPanel>

          <EditorPanel
            previewTarget="contact-form-panel"
            title="Form Elements"
            description="Choose which standard fields appear and add custom elements to the public inquiry form."
          >
            <SectionMarker
              icon={Rows3}
              title="Field selection and custom elements"
              description="Name and message stay as the core contact fields. Email and phone can be shown or hidden, and you can add extra text, phone, textarea, email, or select fields below."
            />

            <form
              className="space-y-8"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Form elements saved",
                  "The contact form structure is saved to draft and visible in preview.",
                );
              }}
            >
              <div className="rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <h4 className="text-lg font-serif font-bold text-primary">Standard fields</h4>
                <p className="mt-2 text-sm leading-relaxed text-primary/45">
                  `Name` and `Message` are always shown. Use these controls to select the optional built-in fields that should remain visible.
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <SelectField
                    label="Show Email Field"
                    value={fieldVisibility.email ? "true" : "false"}
                    onChange={(value) =>
                      updateNested("contact_page.form_panel.field_visibility.email", value === "true")
                    }
                    options={booleanOptions}
                  />
                  <SelectField
                    label="Show Phone Field"
                    value={fieldVisibility.phone ? "true" : "false"}
                    onChange={(value) =>
                      updateNested("contact_page.form_panel.field_visibility.phone", value === "true")
                    }
                    options={booleanOptions}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-primary">Custom fields</h4>
                    <p className="mt-2 text-sm leading-relaxed text-primary/45">
                      Add extra form elements and choose their type, width, visibility, and requirement state.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => addCustomField("text")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
                    >
                      <ListPlus className="h-4 w-4" />
                      Add Text
                    </button>
                    <button
                      type="button"
                      onClick={() => addCustomField("textarea")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
                    >
                      <ListPlus className="h-4 w-4" />
                      Add Textarea
                    </button>
                    <button
                      type="button"
                      onClick={() => addCustomField("select")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
                    >
                      <ListPlus className="h-4 w-4" />
                      Add Select
                    </button>
                  </div>
                </div>

                {formPanel.custom_fields.length === 0 ? (
                  <div className="mt-6 rounded-[24px] border border-dashed border-primary/10 bg-white px-6 py-8 text-sm text-primary/40">
                    No custom elements yet. Use the add buttons above to include extra fields in the contact form.
                  </div>
                ) : (
                  <div className="mt-6 grid gap-6">
                    {formPanel.custom_fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-[24px] border border-primary/5 bg-white p-5 shadow-premium"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
                              Custom element {index + 1}
                            </p>
                            <h5 className="mt-2 text-lg font-serif font-bold text-primary">
                              {field.label || "Untitled field"}
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomField(field.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/55 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                          <TextField
                            label="Field Label"
                            value={field.label}
                            onChange={(value) => updateCustomField(field.id, { label: value })}
                            placeholder="Preferred branch"
                          />
                          <TextField
                            label="Placeholder"
                            value={field.placeholder}
                            onChange={(value) =>
                              updateCustomField(field.id, { placeholder: value })
                            }
                            placeholder="Choose or type a value"
                          />
                          <SelectField
                            label="Field Type"
                            value={field.type}
                            onChange={(value) =>
                              updateCustomField(field.id, {
                                type: value as CustomFormField["type"],
                                width: value === "textarea" ? "full" : field.width,
                                options:
                                  value === "select"
                                    ? field.options.length > 0
                                      ? field.options
                                      : ["Option 1", "Option 2"]
                                    : [],
                              })
                            }
                            options={fieldTypeOptions}
                          />
                          <SelectField
                            label="Field Width"
                            value={field.width}
                            onChange={(value) =>
                              updateCustomField(field.id, {
                                width: value as CustomFormField["width"],
                              })
                            }
                            options={widthOptions}
                          />
                          <SelectField
                            label="Required"
                            value={field.required ? "true" : "false"}
                            onChange={(value) =>
                              updateCustomField(field.id, { required: value === "true" })
                            }
                            options={booleanOptions}
                          />
                          <SelectField
                            label="Visible"
                            value={field.is_visible ? "true" : "false"}
                            onChange={(value) =>
                              updateCustomField(field.id, { is_visible: value === "true" })
                            }
                            options={booleanOptions}
                          />
                        </div>

                        {field.type === "select" ? (
                          <div className="mt-6">
                            <TextAreaField
                              label="Select Options"
                              value={field.options.join("\n")}
                              onChange={(value) =>
                                updateCustomField(field.id, {
                                  options: value
                                    .split("\n")
                                    .map((option) => option.trim())
                                    .filter(Boolean),
                                })
                              }
                              placeholder={"Morning shift\nEvening shift"}
                              rows={4}
                            />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <SaveButton saving={saving} label="Save form elements" />
            </form>
          </EditorPanel>

          <EditorPanel
            previewTarget="contact-form-panel"
            title="Inquiry Form Styling"
            description="Control the panel background plus the typography, colors, and input treatment for the entire right-side form."
          >
            <SectionMarker
              icon={Palette}
              title="Right-side visual controls"
              description="Title, subtitle, labels, inputs, placeholders, and button styling are now adjustable in admin instead of being frozen in the component."
            />

            <form
              className="space-y-8"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Inquiry form styling saved",
                  "The visual styling for the right-side form is saved to draft and visible in preview.",
                );
              }}
            >
              <div className="space-y-6 rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <h4 className="text-lg font-serif font-bold text-primary">Panel and heading</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <ColorField
                    label="Form Panel Background"
                    value={formStyles.panel_background}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.panel_background", value)
                    }
                  />
                  <ColorField
                    label="Title Color"
                    value={formStyles.title_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.title_color", value)
                    }
                  />
                  <TextField
                    label="Title Size"
                    value={formStyles.title_size}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.title_size", value)
                    }
                    placeholder="32px"
                  />
                  <SelectField
                    label="Title Font Family"
                    value={formStyles.title_font_family}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.title_font_family", value)
                    }
                    options={fontFamilyOptions}
                  />
                  <SelectField
                    label="Title Font Style"
                    value={formStyles.title_font_style}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.title_font_style", value)
                    }
                    options={fontStyleOptions}
                  />
                  <ColorField
                    label="Subtitle Color"
                    value={formStyles.subtitle_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.subtitle_color", value)
                    }
                  />
                  <TextField
                    label="Subtitle Size"
                    value={formStyles.subtitle_size}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.subtitle_size", value)
                    }
                    placeholder="16px"
                  />
                  <SelectField
                    label="Subtitle Font Style"
                    value={formStyles.subtitle_font_style}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.subtitle_font_style", value)
                    }
                    options={fontStyleOptions}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <h4 className="text-lg font-serif font-bold text-primary">Labels and inputs</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <ColorField
                    label="Label Color"
                    value={formStyles.label_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.label_color", value)
                    }
                  />
                  <TextField
                    label="Label Size"
                    value={formStyles.label_size}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.label_size", value)
                    }
                    placeholder="10px"
                  />
                  <SelectField
                    label="Label Font Style"
                    value={formStyles.label_font_style}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.label_font_style", value)
                    }
                    options={fontStyleOptions}
                  />
                  <ColorField
                    label="Input Background"
                    value={formStyles.input_background}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_background", value)
                    }
                  />
                  <ColorField
                    label="Input Border Color"
                    value={formStyles.input_border_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_border_color", value)
                    }
                  />
                  <ColorField
                    label="Input Text Color"
                    value={formStyles.input_text_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_text_color", value)
                    }
                  />
                  <ColorField
                    label="Placeholder Color"
                    value={formStyles.input_placeholder_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_placeholder_color", value)
                    }
                  />
                  <TextField
                    label="Input Font Size"
                    value={formStyles.input_font_size}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_font_size", value)
                    }
                    placeholder="16px"
                  />
                  <SelectField
                    label="Input Font Style"
                    value={formStyles.input_font_style}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.input_font_style", value)
                    }
                    options={fontStyleOptions}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-[28px] border border-primary/5 bg-primary/[0.02] p-6">
                <h4 className="text-lg font-serif font-bold text-primary">Submit button</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <ColorField
                    label="Button Background"
                    value={formStyles.button_background}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_background", value)
                    }
                  />
                  <ColorField
                    label="Button Hover Background"
                    value={formStyles.button_hover_background}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_hover_background", value)
                    }
                  />
                  <ColorField
                    label="Button Text Color"
                    value={formStyles.button_text_color}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_text_color", value)
                    }
                  />
                  <TextField
                    label="Button Font Size"
                    value={formStyles.button_font_size}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_font_size", value)
                    }
                    placeholder="18px"
                  />
                  <SelectField
                    label="Button Font Family"
                    value={formStyles.button_font_family}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_font_family", value)
                    }
                    options={fontFamilyOptions}
                  />
                  <SelectField
                    label="Button Font Style"
                    value={formStyles.button_font_style}
                    onChange={(value) =>
                      updateNested("contact_page.form_styles.button_font_style", value)
                    }
                    options={fontStyleOptions}
                  />
                </div>
              </div>

              <SaveButton saving={saving} label="Save inquiry form styling" />
            </form>
          </EditorPanel>

          <EditorPanel
            previewTarget="contact-map-section"
            title="Map Block and Workflow"
            description="Configure the optional map section below the contact form and keep the inquiry inbox within reach."
          >
            <SectionMarker
              icon={Map}
              title="Map and inbound flow"
              description="The old contact editor exposed a map URL without showing it on the public page. This section keeps the map and inbox aligned with the actual contact experience."
            />

            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                await saveDraftSection(
                  "Map block saved",
                  "The map embed and section copy are saved to draft and visible in preview.",
                );
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Map Section Title"
                  value={mapSection.title}
                  onChange={(value) => updateNested("contact_page.map_section.title", value)}
                  placeholder="Visit us on the map"
                />
                <TextAreaField
                  label="Map Section Description"
                  value={mapSection.description}
                  onChange={(value) =>
                    updateNested("contact_page.map_section.description", value)
                  }
                  placeholder="Use the map below to find our campus quickly."
                  rows={3}
                />
              </div>

              <TextAreaField
                label="Google Maps Embed URL"
                value={contactInfo?.map_embed || ""}
                onChange={(value) => updateNested("contact_info.map_embed", value)}
                placeholder="Paste the Google Maps embed URL that should appear below the contact page."
                rows={4}
              />

              <SaveButton saving={saving} label="Save map block" />
            </form>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <ShortcutCard
                href="/admin/contacts"
                title="Admissions Inbox"
                description="Review, mark, and delete incoming contact submissions generated from the public inquiry form."
                statLabel="Unread / total"
                statValue={`${summary.unread}/${summary.total}`}
                linkLabel="Open inbox"
              />

              <div className="rounded-[30px] border border-primary/5 bg-primary p-6 text-white shadow-premium">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                  Coverage
                </p>
                <h4 className="mt-3 text-xl font-serif font-bold">Contact editor now controls</h4>
                <div className="mt-6 grid gap-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Left-side admissions copy and contact cards
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Right-side form copy, labels, placeholders, and submit states
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Right-side colors, sizes, font styles, and button treatment
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Map embed and map section copy below the contact layout
                  </div>
                </div>
              </div>
            </div>
          </EditorPanel>
        </div>

        <LivePreviewPanel title="Contact Page Preview" previewType="page">
          <PublicPagePreview settings={settings} pathname="/contact">
            <ContactPageView settings={settings} interactive={false} />
          </PublicPagePreview>
        </LivePreviewPanel>
      </div>
      </div>
    </PreviewSyncProvider>
  );
}
