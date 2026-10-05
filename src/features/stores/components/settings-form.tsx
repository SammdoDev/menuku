"use client";

import { useCallback, useState } from "react";
import type { Tenant } from "@/features/stores/types";
import { updateStoreSettingsAction } from "@/features/stores/actions/update-store-settings-action";
import StoreAppearanceSection from "@/features/stores/components/settings/store-appearance-section";
import StoreDetailsSection from "@/features/stores/components/settings/store-details-section";
import StoreOpeningHoursSection from "@/features/stores/components/settings/store-opening-hours-section";
import StoreProfileSection from "@/features/stores/components/settings/store-profile-section";
import StorePromoSection from "@/features/stores/components/settings/store-promo-section";
import StoreUrlSection from "@/features/stores/components/settings/store-url-section";
import useSettingsImageUpload from "@/features/stores/hooks/use-settings-image-upload";
import ImageCropDialog from "@/components/ui/image-crop-dialog";
import PersistentForm from "@/components/ui/persistent-form";
import { SubmitButton } from "@/components/ui/submit-button";

type SettingsFormProps = {
  tenant: Tenant;
  siteOrigin: string;
};

function SettingsForm({ tenant, siteOrigin }: SettingsFormProps) {
  const [slug, setSlug] = useState(tenant.slug);
  const [primaryColor, setPrimaryColor] = useState(tenant.primary_color || "#FF6534");
  const [backgroundColor, setBackgroundColor] = useState(tenant.background_color || "#F7F6F2");
  const [layout, setLayout] = useState<"grid" | "list">(
    tenant.layout_type === "list" ? "list" : "grid",
  );
  const imageUpload = useSettingsImageUpload({
    initialLogo: tenant.logo_url,
    initialBanner: tenant.banner_url,
    initialPromoImage: tenant.promo_image_url,
  });
  const canUsePromo = tenant.plan !== "free";
  const canUseCustomStyle = tenant.plan !== "free";

  const restoreValues = useCallback((values: Record<string, string | boolean>) => {
    if (typeof values.slug === "string") setSlug(values.slug);
    if (typeof values.primaryColor === "string") setPrimaryColor(values.primaryColor);
    if (typeof values.backgroundColor === "string") setBackgroundColor(values.backgroundColor);
    if (values.layoutType === "grid" || values.layoutType === "list") setLayout(values.layoutType);
  }, []);

  return (
    <PersistentForm
      storageKey="menuku-settings-form"
      action={updateStoreSettingsAction}
      className="grid items-start gap-5 xl:grid-cols-[1.15fr_.85fr]"
      onRestore={restoreValues}
    >
      <div className="grid gap-5">
        <StoreProfileSection
          name={tenant.name}
          logo={imageUpload.logo}
          banner={imageUpload.banner}
          uploading={imageUpload.uploading}
          uploadError={imageUpload.uploadError}
          onSelectFile={imageUpload.selectFile}
          onLogoChange={imageUpload.setLogo}
          onBannerChange={imageUpload.setBanner}
        />
        <StoreDetailsSection tenant={tenant} />
        <StoreOpeningHoursSection openingHours={tenant.opening_hours} />
        <StoreUrlSection siteOrigin={siteOrigin} slug={slug} onSlugChange={setSlug} />
        <StorePromoSection
          tenant={tenant}
          canUsePromo={canUsePromo}
          promoImage={imageUpload.promoImage}
          uploading={imageUpload.uploading}
          onSelectFile={imageUpload.selectFile}
        />
      </div>

      <aside className="grid gap-5 xl:sticky xl:top-24">
        <StoreAppearanceSection
          tenant={tenant}
          canUseCustomStyle={canUseCustomStyle}
          logo={imageUpload.logo}
          banner={imageUpload.banner}
          primaryColor={primaryColor}
          backgroundColor={backgroundColor}
          layout={layout}
          onPrimaryColorChange={setPrimaryColor}
          onBackgroundColorChange={setBackgroundColor}
          onLayoutChange={setLayout}
        />
        <SubmitButton
          pendingLabel="Menyimpan pengaturan..."
          disabled={Boolean(imageUpload.uploading)}
        >
          Simpan semua perubahan
        </SubmitButton>
        <ImageCropDialog
          file={imageUpload.crop?.file || null}
          aspect={
            imageUpload.crop?.kind === "logo"
              ? 1
              : imageUpload.crop?.kind === "promo"
                ? 2.2
                : 16 / 9
          }
          onCancel={() => imageUpload.setCrop(null)}
          onConfirm={(cropped) => {
            const kind = imageUpload.crop?.kind;
            imageUpload.setCrop(null);
            if (kind) void imageUpload.uploadImage(cropped, kind, tenant.slug, slug);
          }}
        />
      </aside>
    </PersistentForm>
  );
}

export default SettingsForm;
