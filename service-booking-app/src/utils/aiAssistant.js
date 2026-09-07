export const analyzeSearchQuery = (query, availableServices = []) => {
  if (!query || query.trim().length < 3) {
    return { category: null, urgency: "Normal", recommendedServices: availableServices };
  }

  const text = query.toLowerCase();

  // 1. Detect Urgency
  let urgency = "Normal";
  const emergencyKeywords = ["urgent", "emergency", "asap", "immediately", "fast", "leak", "leaking", "spark", "flood", "broken", "danger", "burst", "outage"];
  const highKeywords = ["today", "soon", "quick", "same day", "issue", "trouble"];

  if (emergencyKeywords.some((word) => text.includes(word))) {
    urgency = "Emergency / Immediate";
  } else if (highKeywords.some((word) => text.includes(word))) {
    urgency = "High";
  }

  // 2. Detect Category
  let category = null;
  if (text.match(/pipe|water|drain|faucet|toilet|sink|leak|plumb|tap/)) {
    category = "Plumbing";
  } else if (text.match(/light|wire|outlet|switch|power|electric|circuit|fuse/)) {
    category = "Electrical";
  } else if (text.match(/clean|deep clean|dust|wash|maid|carpet|stain/)) {
    category = "Cleaning";
  } else if (text.match(/ac|heat|hvac|air condition|cool|furnace|fan/)) {
    category = "HVAC & Cooling";
  } else if (text.match(/door|table|wood|cabinet|carpenter|furniture|fix/)) {
    category = "Carpentry";
  }else if (text.match(/paint|wall|surface|color/)) {
      category = "Painting";
    } else if (text.match(/fridge|washer|refrigerator|appliance/)) {
      category = "Appliance Repair";
    } else if (text.match(/pest|termite|fumigation|bugs|insects/)) {
      category = "Pest Control";
    }

  // 3. Filter services array based on detected Category and Text search
  const filtered = availableServices.filter((service) => {
    const serviceName = service.name ? service.name.toLowerCase() : "";
    const serviceCat = service.category ? service.category.toLowerCase() : "";
    const desc = service.description ? service.description.toLowerCase() : "";

    if (category) {
      return serviceCat.includes(category.toLowerCase());
    }

    return (
      serviceName.includes(text) ||
      serviceCat.includes(text) ||
      desc.includes(text)
    );
  });

  return {
    category,
    urgency,
    recommendedServices: filtered,
  };
};