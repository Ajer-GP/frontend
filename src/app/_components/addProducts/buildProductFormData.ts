import { FullFormData } from "@/app/_schemas/addProduct.schema";

export function buildProductFormData(data: FullFormData): FormData {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("name", data.name);
  formData.append("usage", data.usage);
  formData.append("category", data.category);
  formData.append("condition", data.condition);
  formData.append("insuranceAmount", String(data.insuranceAmount));

  // Backend expects all three price fields on every product
  formData.append("pricePerHour", String(data.pricePerHour ?? 0));
  formData.append("pricePerDay", String(data.pricePerDay ?? 0));
  formData.append("pricePerWeek", String(data.pricePerWeek ?? 0));

  const { street, buildingNum, floorNum, houseNum, landmark } = data.location;
  // Backend stores location as an object: { street, building, floor, home, mark }
  formData.append(
    "location",
    JSON.stringify({
      street,
      building: buildingNum,
      floor: floorNum,
      home: houseNum,
      mark: landmark,
    }),
  );

  formData.append("handlingNotes", (data.handlingNotes ?? []).join(", "));

  if (data.specs?.length) {
    formData.append(
      "specs",
      JSON.stringify(
        data.specs.map((spec) => ({
          label: spec.title,
          value: spec.value,
        })),
      ),
    );
  }

  if (data.accessories?.length) {
    formData.append(
      "accessories",
      JSON.stringify(data.accessories.map((item) => item.name)),
    );
  }

  if (data.checklist?.length) {
    formData.append("checklist", JSON.stringify(data.checklist));
  }

  if (data.coverImage instanceof File) {
    formData.append("coverImage", data.coverImage);
  }

  for (const file of data.images ?? []) {
    if (file instanceof File) {
      formData.append("images", file);
    }
  }

  return formData;
}
