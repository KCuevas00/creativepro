/**
 * Creative Pro Remodeling LLC - Visual Direct On-Page Inline CMS Engine
 * Enables live on-page typing, drag-and-drop photo reordering, and direct image swapping on Desktop & Mobile.
 */

(function () {
  const STORAGE_KEY = 'cpr_content_v5';
  const isInIframe = window.self !== window.top;
  const isEditorActive = isInIframe;

  if (isEditorActive) {
    window.CPR_ADMIN_ACTIVE = true;
  }

  const LEGACY_PATH_MAP = {
    'videos/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.mp4': 'videos/bathroom-01.mp4',
    'photos/thumbs/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.jpg': 'photos/thumbs/bathroom-01.jpg',
    'videos/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.mp4': 'videos/bathroom-02.mp4',
    'photos/thumbs/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.jpg': 'photos/thumbs/bathroom-02.jpg',
    'videos/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.mp4': 'videos/bathroom-03.mp4',
    'photos/thumbs/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.jpg': 'photos/thumbs/bathroom-03.jpg',
    'videos/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.mp4': 'videos/bathroom-04.mp4',
    'photos/thumbs/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.jpg': 'photos/thumbs/bathroom-04.jpg',
    'videos/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.mp4': 'videos/bathroom-05.mp4',
    'photos/thumbs/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.jpg': 'photos/thumbs/bathroom-05.jpg',
    'videos/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.mp4': 'videos/bathroom-06.mp4',
    'photos/thumbs/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.jpg': 'photos/thumbs/bathroom-06.jpg',
    'videos/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.mp4': 'videos/bathroom-07.mp4',
    'photos/thumbs/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.jpg': 'photos/thumbs/bathroom-07.jpg',
    'videos/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.mp4': 'videos/bathroom-08.mp4',
    'photos/thumbs/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.jpg': 'photos/thumbs/bathroom-08.jpg',
    'videos/att.IwjAXisU4RDxzNMsPoDswte-PZe-Uu6724-7vSLvJBU.mp4': 'videos/bathroom-09.mp4',
    'photos/thumbs/att.IwjAXisU4RDxzNMsPoDswte-PZe-Uu6724-7vSLvJBU.jpg': 'photos/thumbs/bathroom-09.jpg',
    'videos/att.rYje_ysVtDsRHG-D_7YZ-IybIvDUe_cfuIVTW6C3r30.mp4': 'videos/bathroom-10.mp4',
    'photos/thumbs/att.rYje_ysVtDsRHG-D_7YZ-IybIvDUe_cfuIVTW6C3r30.jpg': 'photos/thumbs/bathroom-10.jpg',
    'videos/att.sT2PQgnprZIC0pbfR1510E9l6A9BcaLkppr-KmYGsLg.mp4': 'videos/bathroom-11.mp4',
    'photos/thumbs/att.sT2PQgnprZIC0pbfR1510E9l6A9BcaLkppr-KmYGsLg.jpg': 'photos/thumbs/bathroom-11.jpg',
    'videos/att.970gtKVesR1xjUGCgzqflV2OWC8aKJ6eQjcG_yd52OY.jpg': 'photos/thumbs/bathroom-photo-01.jpg',
    'videos/att.fWpCm0skN6ss4QCZNMa-juQdOCfMdO2ke7EJ_wlxbS0.jpg': 'photos/thumbs/bathroom-photo-02.jpg',
    'videos/att.iv5W4pi6xHmqqS89PVOyyCLy30XCGVuYVkUfE5QwFXE.jpg': 'photos/thumbs/bathroom-photo-03.jpg',
    'videos/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.mp4': 'videos/exterior-01.mp4',
    'photos/thumbs/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.jpg': 'photos/thumbs/exterior-01.jpg',
    'videos/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.mp4': 'videos/exterior-02.mp4',
    'photos/thumbs/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.jpg': 'photos/thumbs/exterior-02.jpg',
    'videos/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.mp4': 'videos/interiors-01.mp4',
    'photos/thumbs/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.jpg': 'photos/thumbs/interiors-01.jpg',
    'videos/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.mp4': 'videos/interiors-02.mp4',
    'photos/thumbs/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.jpg': 'photos/thumbs/interiors-02.jpg',
    'videos/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.mp4': 'videos/interiors-03.mp4',
    'photos/thumbs/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.jpg': 'photos/thumbs/interiors-03.jpg',
    'videos/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.mp4': 'videos/interiors-04.mp4',
    'photos/thumbs/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.jpg': 'photos/thumbs/interiors-04.jpg',
    'videos/att.87zcD-nmSMO7uO8nJ764MOznBh0yLTHlNP4v0vDLDnE.mp4': 'videos/interiors-05.mp4',
    'photos/thumbs/att.87zcD-nmSMO7uO8nJ764MOznBh0yLTHlNP4v0vDLDnE.jpg': 'photos/thumbs/interiors-05.jpg',
    'videos/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.mp4': 'videos/kitchen-01.mp4',
    'photos/thumbs/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.jpg': 'photos/thumbs/kitchen-01.jpg',
    'videos/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.mp4': 'videos/kitchen-02.mp4',
    'photos/thumbs/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.jpg': 'photos/thumbs/kitchen-02.jpg',
    'videos/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.mp4': 'videos/kitchen-03.mp4',
    'photos/thumbs/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.jpg': 'photos/thumbs/kitchen-03.jpg',
    'videos/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.mp4': 'videos/kitchen-04.mp4',
    'photos/thumbs/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.jpg': 'photos/thumbs/kitchen-04.jpg',
    'videos/bathroom-photo-01.jpg': 'photos/thumbs/bathroom-photo-01.jpg',
    'videos/bathroom-photo-02.jpg': 'photos/thumbs/bathroom-photo-02.jpg',
    'videos/bathroom-photo-03.jpg': 'photos/thumbs/bathroom-photo-03.jpg',
    'videos/att.12zTKoL6to7uOHKWBSH0b5bw9LYS8T6cXKnVDQcsyS4.mp4': 'videos/interiors-06.mp4',
    'photos/thumbs/att.12zTKoL6to7uOHKWBSH0b5bw9LYS8T6cXKnVDQcsyS4.jpg': 'photos/thumbs/interiors-06.jpg',
    'videos/att.7Ce_VjSQmSfKSacrBupcEAKK85CcdNdpeCp97f45AbU.mp4': 'videos/interiors-07.mp4',
    'photos/thumbs/att.7Ce_VjSQmSfKSacrBupcEAKK85CcdNdpeCp97f45AbU.jpg': 'photos/thumbs/interiors-07.jpg',
    'videos/att.fSvLOYr2T6QrB_POglUttIKx-s1Cg3FNdoHLwQCiZ7U.mp4': 'videos/kitchen-05.mp4',
    'photos/thumbs/att.fSvLOYr2T6QrB_POglUttIKx-s1Cg3FNdoHLwQCiZ7U.jpg': 'photos/thumbs/kitchen-05.jpg',
    'videos/att.T0KLtl8-YB9RSjJYIBMfi9WJbqbXX6Qg-PdAjnD-HUc.mp4': 'videos/bathroom-12.mp4',
    'photos/thumbs/att.T0KLtl8-YB9RSjJYIBMfi9WJbqbXX6Qg-PdAjnD-HUc.jpg': 'photos/thumbs/bathroom-12.jpg',
    'videos/att.UAqBvxUHVoLAkji2QwGkqSC74nRkwcdZ3qv5ckJqcQI.mp4': 'videos/bathroom-13.mp4',
    'photos/thumbs/att.UAqBvxUHVoLAkji2QwGkqSC74nRkwcdZ3qv5ckJqcQI.jpg': 'photos/thumbs/bathroom-13.jpg',
    'videos/att.IrDpI5xnp9YfCoqY_fik7pA2sJjwKqMjyrtGPVEs6k4.jpg': 'photos/interiors-photo-01.jpg',
    'photos/thumbs/att.IrDpI5xnp9YfCoqY_fik7pA2sJjwKqMjyrtGPVEs6k4.jpg': 'photos/thumbs/interiors-photo-01.jpg',
    'videos/att.JVJxCiSPlG-nMOSj1YYHkapY2hV0O5aHJo9Zc5Rbzsc.png': 'photos/bathroom-photo-04.jpg',
    'photos/thumbs/att.JVJxCiSPlG-nMOSj1YYHkapY2hV0O5aHJo9Zc5Rbzsc.jpg': 'photos/thumbs/bathroom-photo-04.jpg',
    'videos/att.fLuvGVsWYKfwMTb-K4ORbtthR5GNCDe5S32IRFep4IE.jpg': 'photos/bathroom-photo-05.jpg',
    'photos/thumbs/att.fLuvGVsWYKfwMTb-K4ORbtthR5GNCDe5S32IRFep4IE.jpg': 'photos/thumbs/bathroom-photo-05.jpg',
    'videos/att.4vK7FRPyDW6NH9k0dSzQ8U0-ANX4RjzQ5qLKoRUkmSQ.jpg': 'photos/bathroom-photo-06.jpg',
    'photos/thumbs/att.4vK7FRPyDW6NH9k0dSzQ8U0-ANX4RjzQ5qLKoRUkmSQ.jpg': 'photos/thumbs/bathroom-photo-06.jpg',
    'videos/att.ko1wMX-qao2nyoG9vsz43zjkWPYZNoc40j3A-wyDdhE.jpg': 'photos/bathroom-design-01.jpg',
    'photos/thumbs/att.ko1wMX-qao2nyoG9vsz43zjkWPYZNoc40j3A-wyDdhE.jpg': 'photos/thumbs/bathroom-design-01.jpg',
    'videos/att.AbjF8Ro8zFk-mASim-cejhKrTH2q6Giy2B3_XKohBOw.jpg': 'photos/bathroom-design-02.jpg',
    'photos/thumbs/att.AbjF8Ro8zFk-mASim-cejhKrTH2q6Giy2B3_XKohBOw.jpg': 'photos/thumbs/bathroom-design-02.jpg',
    'videos/att.j2w8Fe0xWmKYQbFxKoZCyLonbAtngKbcRflUvsR5VWo.jpg': 'photos/bathroom-design-03.jpg',
    'photos/thumbs/att.j2w8Fe0xWmKYQbFxKoZCyLonbAtngKbcRflUvsR5VWo.jpg': 'photos/thumbs/bathroom-design-03.jpg',
  };

  function normalizePath(p) {
    if (!p || typeof p !== 'string') return p;
    return LEGACY_PATH_MAP[p] || p;
  }

  function sanitizeData(data) {
    if (!data) return data;
    if (data.portfolio && Array.isArray(data.portfolio.items)) {
      data.portfolio.items.forEach((item) => {
        if (item.media) item.media = normalizePath(item.media);
        if (item.poster) item.poster = normalizePath(item.poster);
      });
    }
    return data;
  }

  // Embedded Default Site Data Fallback
  let siteData = {
    global: {
      brandName: "CREATIVE PRO REMODELING LLC",
      craftsman: "Master Craftsman",
      phone: "(847) 624-1501",
      phoneRaw: "8476241501",
      locationText: "Elgin, IL & Surrounding Chicagoland Suburbs",
      copyright: "© 2026 Creative Pro Remodeling LLC. All rights reserved."
    },
    home: {
      heroHeadline: "Custom Remodeling. Expertly Crafted.",
      heroCtaText: "Call (847) 624-1501",
      stat1Num: "15+",
      stat1Label: "Years Master Experience",
      stat2Num: "100%",
      stat2Label: "Owner On-Site Oversight",
      stat3Num: "5★",
      stat3Label: "Chicagoland Craftsmanship",
      stat4Num: "Free",
      stat4Label: "On-Site Consultations",
      ctaTitle: "Ready to build your dream space?",
      ctaDesc: "Work directly with our master craftsmen. Honest timelines, transparent pricing, and master-level execution."
    },
    about: {
      pageTitle: "About Creative Pro Remodeling LLC",
      pageSubtitle: "Decades of hands-on mastery, direct craftsman oversight, and a personal commitment to treating your home as if it were our own.",
      craftsmanEyebrow: "The Master Craftsman",
      craftsmanName: "Master Craftsmanship",
      craftsmanBio1: "Creative Pro Remodeling LLC was founded on a simple, uncompromising principle: delivering high-end remodeling without the communication gaps, shortcuts, or stress typical of large contractor firms.",
      craftsmanBio2: "Led personally by experienced master craftsmen, our team brings decades of field-tested carpentry, precision tile setting, plumbing, electrical, and structural finish expertise directly to your home. When you hire Creative Pro, you work directly with our lead craftsmen from Day 1 through final inspection."
    },
    services: {
      pageTitle: "Our Remodeling Services",
      pageSubtitle: "From luxury kitchen and bathroom transformations to complete basement suites and home additions, we handle your project with master-level precision."
    },
    portfolio: {
      pageTitle: "Project Gallery",
      pageSubtitle: "Browse our complete showcase of custom kitchens, luxury bathroom transformations, interior living spaces, and exterior additions across Elgin, IL and the surrounding Chicagoland area.",
            items: [
        {"id": "p0", "category": "kitchens", "type": "video", "media": "videos/kitchen-01.mp4", "poster": "photos/thumbs/kitchen-01.jpg", "catName": "Kitchens"},
        {"id": "p1", "category": "kitchens", "type": "video", "media": "videos/kitchen-02.mp4", "poster": "photos/thumbs/kitchen-02.jpg", "catName": "Kitchens"},
        {"id": "p2", "category": "kitchens", "type": "video", "media": "videos/kitchen-03.mp4", "poster": "photos/thumbs/kitchen-03.jpg", "catName": "Kitchens"},
        {"id": "p3", "category": "kitchens", "type": "video", "media": "videos/kitchen-04.mp4", "poster": "photos/thumbs/kitchen-04.jpg", "catName": "Kitchens"},
        {"id": "p4", "category": "kitchens", "type": "video", "media": "videos/kitchen-05.mp4", "poster": "photos/thumbs/kitchen-05.jpg", "catName": "Kitchens"},
        {"id": "p5", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-01.jpg", "poster": "photos/thumbs/bathroom-photo-01.jpg", "catName": "Bathrooms"},
        {"id": "p6", "category": "bathrooms", "type": "video", "media": "videos/bathroom-01.mp4", "poster": "photos/thumbs/bathroom-01.jpg", "catName": "Bathrooms"},
        {"id": "p7", "category": "bathrooms", "type": "video", "media": "videos/bathroom-02.mp4", "poster": "photos/thumbs/bathroom-02.jpg", "catName": "Bathrooms"},
        {"id": "p8", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-02.jpg", "poster": "photos/thumbs/bathroom-photo-02.jpg", "catName": "Bathrooms"},
        {"id": "p9", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-03.jpg", "poster": "photos/thumbs/bathroom-photo-03.jpg", "catName": "Bathrooms"},
        {"id": "p10", "category": "bathrooms", "type": "video", "media": "videos/bathroom-03.mp4", "poster": "photos/thumbs/bathroom-03.jpg", "catName": "Bathrooms"},
        {"id": "p11", "category": "bathrooms", "type": "video", "media": "videos/bathroom-04.mp4", "poster": "photos/thumbs/bathroom-04.jpg", "catName": "Bathrooms"},
        {"id": "p12", "category": "bathrooms", "type": "video", "media": "videos/bathroom-05.mp4", "poster": "photos/thumbs/bathroom-05.jpg", "catName": "Bathrooms"},
        {"id": "p13", "category": "bathrooms", "type": "video", "media": "videos/bathroom-06.mp4", "poster": "photos/thumbs/bathroom-06.jpg", "catName": "Bathrooms"},
        {"id": "p14", "category": "bathrooms", "type": "video", "media": "videos/bathroom-07.mp4", "poster": "photos/thumbs/bathroom-07.jpg", "catName": "Bathrooms"},
        {"id": "p15", "category": "bathrooms", "type": "video", "media": "videos/bathroom-08.mp4", "poster": "photos/thumbs/bathroom-08.jpg", "catName": "Bathrooms"},
        {"id": "p16", "category": "bathrooms", "type": "video", "media": "videos/bathroom-09.mp4", "poster": "photos/thumbs/bathroom-09.jpg", "catName": "Bathrooms"},
        {"id": "p17", "category": "bathrooms", "type": "video", "media": "videos/bathroom-10.mp4", "poster": "photos/thumbs/bathroom-10.jpg", "catName": "Bathrooms"},
        {"id": "p18", "category": "bathrooms", "type": "video", "media": "videos/bathroom-11.mp4", "poster": "photos/thumbs/bathroom-11.jpg", "catName": "Bathrooms"},
        {"id": "p19", "category": "bathrooms", "type": "video", "media": "videos/bathroom-12.mp4", "poster": "photos/thumbs/bathroom-12.jpg", "catName": "Bathrooms"},
        {"id": "p20", "category": "bathrooms", "type": "video", "media": "videos/bathroom-13.mp4", "poster": "photos/thumbs/bathroom-13.jpg", "catName": "Bathrooms"},
        {"id": "p21", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-04.jpg", "poster": "photos/thumbs/bathroom-photo-04.jpg", "catName": "Bathrooms"},
        {"id": "p22", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-05.jpg", "poster": "photos/thumbs/bathroom-photo-05.jpg", "catName": "Bathrooms"},
        {"id": "p23", "category": "bathrooms", "type": "image", "media": "photos/bathroom-photo-06.jpg", "poster": "photos/thumbs/bathroom-photo-06.jpg", "catName": "Bathrooms"},
        {"id": "p24", "category": "bathrooms", "type": "image", "media": "photos/bathroom-design-01.jpg", "poster": "photos/thumbs/bathroom-design-01.jpg", "catName": "Bathrooms"},
        {"id": "p25", "category": "bathrooms", "type": "image", "media": "photos/bathroom-design-02.jpg", "poster": "photos/thumbs/bathroom-design-02.jpg", "catName": "Bathrooms"},
        {"id": "p26", "category": "bathrooms", "type": "image", "media": "photos/bathroom-design-03.jpg", "poster": "photos/thumbs/bathroom-design-03.jpg", "catName": "Bathrooms"},
        {"id": "p27", "category": "interiors", "type": "image", "media": "photos/interiors-photo-01.jpg", "poster": "photos/thumbs/interiors-photo-01.jpg", "catName": "Interiors & Flooring"},
        {"id": "p28", "category": "interiors", "type": "video", "media": "videos/interiors-01.mp4", "poster": "photos/thumbs/interiors-01.jpg", "catName": "Interiors & Flooring"},
        {"id": "p29", "category": "interiors", "type": "video", "media": "videos/interiors-02.mp4", "poster": "photos/thumbs/interiors-02.jpg", "catName": "Interiors & Flooring"},
        {"id": "p30", "category": "interiors", "type": "video", "media": "videos/interiors-03.mp4", "poster": "photos/thumbs/interiors-03.jpg", "catName": "Interiors & Flooring"},
        {"id": "p31", "category": "interiors", "type": "video", "media": "videos/interiors-04.mp4", "poster": "photos/thumbs/interiors-04.jpg", "catName": "Interiors & Flooring"},
        {"id": "p32", "category": "interiors", "type": "video", "media": "videos/interiors-05.mp4", "poster": "photos/thumbs/interiors-05.jpg", "catName": "Interiors & Flooring"},
        {"id": "p33", "category": "interiors", "type": "video", "media": "videos/interiors-06.mp4", "poster": "photos/thumbs/interiors-06.jpg", "catName": "Interiors & Flooring"},
        {"id": "p34", "category": "interiors", "type": "video", "media": "videos/interiors-07.mp4", "poster": "photos/thumbs/interiors-07.jpg", "catName": "Interiors & Flooring"},
        {"id": "p35", "category": "exterior", "type": "video", "media": "videos/exterior-01.mp4", "poster": "photos/thumbs/exterior-01.jpg", "catName": "Exterior & Additions"},
        {"id": "p36", "category": "exterior", "type": "video", "media": "videos/exterior-02.mp4", "poster": "photos/thumbs/exterior-02.jpg", "catName": "Exterior & Additions"}
      ]
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getNested(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }

  function setNested(obj, path, value) {
    if (!obj || !path) return;
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function notifyStateChange() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {}

    if (isInIframe) {
      window.parent.postMessage({ type: 'CPR_STATE_CHANGED', payload: siteData }, '*');
    }
  }

  // ================= 1. DOM BINDING & SYNC =================
  function applyContent(data) {
    if (data && typeof data === 'object') {
      siteData = deepClone(data);
    }

    if (!siteData.global) siteData.global = {};
    if (!siteData.home) siteData.home = {};
    if (!siteData.about) siteData.about = {};
    if (!siteData.services) siteData.services = {};
    if (!siteData.portfolio) siteData.portfolio = { items: [] };

    // Update text elements by [data-cms]
    document.querySelectorAll('[data-cms]').forEach((el) => {
      const key = el.getAttribute('data-cms');
      const val = getNested(siteData, key);
      if (val !== undefined && val !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = val;
        } else {
          el.innerHTML = val;
        }
      }
    });

    // Update image sources
    document.querySelectorAll('[data-cms-img]').forEach((el) => {
      const key = el.getAttribute('data-cms-img');
      const val = getNested(siteData, key);
      if (val) el.src = val;
    });

    // Update Global Phone Links
    if (siteData.global && siteData.global.phoneRaw) {
      const p = siteData.global.phoneRaw;
      document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
        a.href = `tel:${p}`;
      });
    }

    // Dynamic Portfolio Gallery Sync
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && siteData.portfolio && Array.isArray(siteData.portfolio.items) && siteData.portfolio.items.length > 0) {
      renderGalleryGrid(galleryGrid, siteData.portfolio.items);
    }

    if (siteData.portfolio && Array.isArray(siteData.portfolio.items)) {
      updateCategoryProjectCounts(siteData.portfolio.items);
    }

    // Initialize visual admin overlay if active
    if (isEditorActive) {
      enableVisualAdmin();
    }
  }

  function updateCategoryProjectCounts(items) {
    if (!items || !Array.isArray(items)) return;
    const counts = {};
    items.forEach((item) => {
      const cat = (item.category || '').toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    document.querySelectorAll('.cat-tile[data-cat]').forEach((tile) => {
      const cat = (tile.getAttribute('data-cat') || '').toLowerCase();
      const count = counts[cat] || 0;
      const em = tile.querySelector('.cat-tile-info em');
      if (em) {
        em.innerHTML = `${count} ${count === 1 ? 'project' : 'projects'} &middot; View &rarr;`;
      }
    });

    const galleryCount = document.getElementById('gallery-count');
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = (urlParams.get('cat') || '').toLowerCase();
    if (galleryCount && activeCategory && activeCategory !== 'all') {
      const count = counts[activeCategory] || 0;
      galleryCount.textContent = count + (count === 1 ? ' project' : ' projects');
    }
  }

  // ================= 2. DYNAMIC GALLERY RENDERING & TOOLS =================
  const videoIconSvg = `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  const photoIconSvg = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;

  function renderGalleryGrid(container, items) {
    if (!items || !container) return;

    // Preserve existing category filter state if user was viewing one
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = (urlParams.get('cat') || '').toLowerCase();

    // In admin mode, inject the "➕ Add New Image or Video" banner above the gallery grid
    if (isEditorActive) {
      let addBanner = container.parentElement.querySelector('.cpr-admin-add-photo-banner');
      if (!addBanner) {
        addBanner = document.createElement('div');
        addBanner.className = 'cpr-admin-add-photo-banner';
        addBanner.innerHTML = `
          <button type="button" class="cpr-add-photo-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="12" y2="12"/></svg>
            <span>Agregar Foto o Video a la Galería</span>
          </button>
        `;
        addBanner.querySelector('button').addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAddMediaModal();
        });
        container.parentElement.insertBefore(addBanner, container);
      }
    }

    container.innerHTML = '';
    let draggedItemIdx = null;

    items.forEach((item, idx) => {
      const isVideo = item.type === 'video';
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-card reveal-up is-visible cpr-editable-card';
      card.setAttribute('data-category', item.category || 'bathrooms');
      card.setAttribute('data-index', idx);
      card.setAttribute('data-type', isVideo ? 'video' : 'image');
      card.setAttribute('data-media', item.media);
      card.setAttribute('data-poster', item.poster || item.media);
      card.setAttribute('data-catname', item.catName || 'Bathrooms');
      card.setAttribute('aria-label', isVideo ? 'Video' : 'Photo');
      card.dataset.index = idx;

      // Filter visibility
      if (activeCategory && activeCategory !== 'all' && item.category !== activeCategory) {
        card.classList.add('is-hidden');
      }

      if (isEditorActive) {
        card.setAttribute('draggable', 'true');

        // Drag and Drop reordering
        card.addEventListener('dragstart', (e) => {
          draggedItemIdx = idx;
          card.classList.add('cpr-dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('cpr-dragging');
          document.querySelectorAll('.cpr-editable-card').forEach((c) => c.classList.remove('cpr-drag-over'));
        });

        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          card.classList.add('cpr-drag-over');
        });

        card.addEventListener('dragleave', () => {
          card.classList.remove('cpr-drag-over');
        });

        card.addEventListener('drop', (e) => {
          e.preventDefault();
          card.classList.remove('cpr-drag-over');
          if (draggedItemIdx !== null && draggedItemIdx !== idx) {
            const moved = siteData.portfolio.items.splice(draggedItemIdx, 1)[0];
            siteData.portfolio.items.splice(idx, 0, moved);
            applyContent(siteData);
            notifyStateChange();
          }
        });
      }

      card.innerHTML = `
        <img src="${item.poster || item.media}" alt="${isVideo ? 'Video' : 'Photo'}" loading="lazy">
        <span class="gallery-card-media-pill">
          ${isVideo ? videoIconSvg : photoIconSvg}
          <span>${isVideo ? 'Video' : 'Photo'}</span>
        </span>
      `;

      // In admin mode, inject floating card toolbar AT THE TOP
      if (isEditorActive) {
        const toolbar = document.createElement('div');
        toolbar.className = 'cpr-photo-toolbar-top';
        toolbar.innerHTML = `
          <button type="button" class="cpr-tb-btn cpr-btn-swap" title="Cambiar foto o video">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Cambiar</span>
          </button>
          <div class="cpr-tb-group">
            <button type="button" class="cpr-tb-btn cpr-btn-left" title="Mover a la izquierda" ${idx === 0 ? 'disabled' : ''}>◀</button>
            <button type="button" class="cpr-tb-btn cpr-btn-right" title="Mover a la derecha" ${idx === items.length - 1 ? 'disabled' : ''}>▶</button>
            <button type="button" class="cpr-tb-btn cpr-btn-delete" title="Eliminar de la galería">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
        `;

        // Swap
        toolbar.querySelector('.cpr-btn-swap').addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          openImagePicker((newSrc) => {
            item.media = newSrc;
            item.poster = newSrc;
            item.type = 'image';
            card.querySelector('img').src = newSrc;
            applyContent(siteData);
            notifyStateChange();
          });
        });

        // Delete
        toolbar.querySelector('.cpr-btn-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (confirm('¿Estás seguro de que deseas eliminar este elemento de tu galería?')) {
            siteData.portfolio.items.splice(idx, 1);
            applyContent(siteData);
            notifyStateChange();
          }
        });

        // Move Left
        toolbar.querySelector('.cpr-btn-left').addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (idx > 0) {
            const temp = siteData.portfolio.items[idx - 1];
            siteData.portfolio.items[idx - 1] = siteData.portfolio.items[idx];
            siteData.portfolio.items[idx] = temp;
            applyContent(siteData);
            notifyStateChange();
          }
        });

        // Move Right
        toolbar.querySelector('.cpr-btn-right').addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (idx < siteData.portfolio.items.length - 1) {
            const temp = siteData.portfolio.items[idx + 1];
            siteData.portfolio.items[idx + 1] = siteData.portfolio.items[idx];
            siteData.portfolio.items[idx] = temp;
            applyContent(siteData);
            notifyStateChange();
          }
        });

        card.appendChild(toolbar);
      }

      container.appendChild(card);
    });

    // Refresh active filter & category counts
    if (window.cprRefreshGalleryFilter) {
      window.cprRefreshGalleryFilter();
    }
  }

  // ================= 3. DIRECT VISUAL INLINE EDITING ENGINE =================
  function enableVisualAdmin() {
    if (!isEditorActive) return;

    if (!document.getElementById('cpr-visual-admin-styles')) {
      const style = document.createElement('style');
      style.id = 'cpr-visual-admin-styles';
      style.textContent = `
        /* High-visibility luxury gold editable text borders */
        [data-cms] {
          outline: 2px dashed rgba(245, 158, 11, 0.75) !important;
          outline-offset: 4px !important;
          background-color: rgba(245, 158, 11, 0.08) !important;
          cursor: text !important;
          transition: all 0.2s ease !important;
          border-radius: 4px !important;
          min-height: 1.2em;
          display: inline-block;
          -webkit-user-modify: read-write-plaintext-only;
        }
        [data-cms]:hover, [data-cms]:active {
          outline: 2.5px solid #f59e0b !important;
          background-color: rgba(245, 158, 11, 0.18) !important;
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.35) !important;
        }
        [data-cms]:focus {
          outline: 3px solid #f59e0b !important;
          background-color: rgba(245, 158, 11, 0.22) !important;
          box-shadow: 0 0 18px rgba(245, 158, 11, 0.5) !important;
        }
        [data-cms].cpr-modified {
          outline: 2.5px solid #d97706 !important;
          background-color: rgba(217, 119, 6, 0.2) !important;
        }

        /* Standalone image change button */
        .cpr-img-change-btn {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          background: rgba(11, 15, 25, 0.92) !important;
          border: 1.5px solid #f59e0b !important;
          color: #f59e0b !important;
          font-family: 'Montserrat', sans-serif !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          padding: 8px 14px !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.7) !important;
          transition: all 0.2s !important;
          z-index: 100 !important;
          pointer-events: auto !important;
        }
        .cpr-img-change-btn:hover {
          background: #f59e0b !important;
          color: #0b1120 !important;
          transform: scale(1.04) !important;
        }

        /* Gallery Add Photo Top Banner */
        .cpr-admin-add-photo-banner {
          width: 100% !important;
          text-align: center !important;
          margin-bottom: 22px !important;
          display: block !important;
        }
        .cpr-add-photo-btn {
          background: rgba(245, 158, 11, 0.12) !important;
          border: 2px dashed #f59e0b !important;
          color: #f59e0b !important;
          font-family: 'Montserrat', sans-serif !important;
          font-size: 0.95rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 14px 28px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.2s !important;
        }
        .cpr-add-photo-btn:hover {
          background: linear-gradient(135deg, #d97706, #f59e0b) !important;
          color: #0b1120 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
        }

        /* Gallery Card Admin Toolbar */
        .cpr-editable-card {
          position: relative !important;
        }
        .cpr-editable-card.cpr-dragging {
          opacity: 0.35 !important;
          border: 2px dashed #f59e0b !important;
        }
        .cpr-editable-card.cpr-drag-over {
          transform: scale(1.04) !important;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.7) !important;
        }
        .cpr-photo-toolbar-top {
          position: absolute !important;
          top: 8px !important;
          left: 8px !important;
          right: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          background: rgba(11, 15, 25, 0.95) !important;
          border: 1px solid #f59e0b !important;
          border-radius: 6px !important;
          padding: 5px 8px !important;
          z-index: 99 !important;
          pointer-events: auto !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.8) !important;
        }
        .cpr-tb-btn {
          background: #1e293b !important;
          border: 1px solid rgba(226, 232, 240, 0.2) !important;
          color: #ffffff !important;
          font-family: 'Montserrat', sans-serif !important;
          font-size: 0.74rem !important;
          font-weight: 700 !important;
          padding: 5px 9px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          transition: all 0.15s !important;
        }
        .cpr-tb-btn:hover:not(:disabled) {
          background: #f59e0b !important;
          color: #0b1120 !important;
          border-color: #f59e0b !important;
        }
        .cpr-tb-btn:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
        .cpr-btn-delete {
          background: rgba(239, 68, 68, 0.25) !important;
          border-color: #ef4444 !important;
          color: #fca5a5 !important;
        }
        .cpr-btn-delete:hover {
          background: #ef4444 !important;
          color: #fff !important;
        }
        .cpr-tb-group {
          display: flex !important;
          gap: 4px !important;
        }

        /* Prevent recursive nesting inside editor frame */
        .footer-admin, #cpr-admin-footer-link {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 1. Make [data-cms] elements contenteditable
    document.querySelectorAll('[data-cms]').forEach((el) => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');

      if (el.tagName === 'A' || el.closest('a')) {
        el.addEventListener('click', (e) => e.preventDefault());
      }

      if (!el._cmsBound) {
        el._cmsBound = true;

        el.addEventListener('input', () => {
          const key = el.getAttribute('data-cms');
          const newHtml = el.innerHTML;
          setNested(siteData, key, newHtml);
          el.classList.add('cpr-modified');
          notifyStateChange();
        });

        el.addEventListener('blur', () => {
          const key = el.getAttribute('data-cms');
          const newHtml = el.innerHTML;
          setNested(siteData, key, newHtml);
          notifyStateChange();
        });
      }
    });

    // 2. Attach Image Swap buttons to standalone [data-cms-img] elements
    document.querySelectorAll('[data-cms-img]').forEach((wrap) => {
      if (wrap.querySelector('.cpr-img-change-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cpr-img-change-btn';
      btn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Cambiar Foto</span>
      `;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = wrap.getAttribute('data-cms-img');
        openImagePicker((newSrc) => {
          const img = wrap.tagName === 'IMG' ? wrap : wrap.querySelector('img');
          if (img) img.src = newSrc;
          if (key) setNested(siteData, key, newSrc);
          wrap.classList.add('cpr-modified');
          notifyStateChange();
        });
      });

      wrap.style.position = 'relative';
      wrap.appendChild(btn);
    });

    // Notify parent frame
    if (isInIframe) {
      window.parent.postMessage({ type: 'CPR_INIT_DATA', payload: siteData }, '*');
    }
  }

  // ================= 4. ADD MEDIA & IMAGE PICKER =================
  function openAddMediaModal() {
    let modal = document.getElementById('cpr-add-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cpr-add-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(11, 15, 25, 0.92); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center; padding: 20px;
      `;
      modal.innerHTML = `
        <div style="background:#141d2e; border:1px solid rgba(245,158,11,0.5); border-radius:12px; padding:28px 24px; max-width:440px; width:100%; box-shadow:0 16px 40px rgba(0,0,0,0.8); font-family:'Montserrat',sans-serif;">
          <h3 style="color:#ffffff; margin:0 0 6px; font-size:1.25rem;">Agregar Proyecto a la Galería</h3>
          <p style="color:#94a3b8; font-size:0.85rem; margin:0 0 20px;">Sube una foto para tu portafolio.</p>
          
          <div style="margin-bottom:16px;">
            <label style="display:block; color:#e2e8f0; font-size:0.8rem; font-weight:700; text-transform:uppercase; margin-bottom:6px;">Categoría</label>
            <select id="cpr-modal-cat" style="width:100%; background:#0b1120; border:1px solid #334155; color:#fff; padding:10px 12px; border-radius:6px; font-family:inherit; font-size:0.9rem;">
              <option value="bathrooms">Baños</option>
              <option value="kitchens">Cocinas</option>
              <option value="interiors">Interiores y Pisos</option>
              <option value="exterior">Exteriores y Ampliaciones</option>
            </select>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block; color:#e2e8f0; font-size:0.8rem; font-weight:700; text-transform:uppercase; margin-bottom:6px;">Subir Archivo de Foto</label>
            <input type="file" id="cpr-modal-file" accept="image/*" style="width:100%; background:#0b1120; border:1px solid #334155; color:#cbd5e1; padding:9px 12px; border-radius:6px; font-family:inherit; font-size:0.85rem;">
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" id="cpr-modal-cancel" style="background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:9px 18px; border-radius:6px; font-family:inherit; font-size:0.85rem; font-weight:600; cursor:pointer;">Cancelar</button>
            <button type="button" id="cpr-modal-submit" style="background:linear-gradient(135deg, #d97706, #f59e0b); border:none; color:#0b1120; padding:9px 20px; border-radius:6px; font-family:inherit; font-size:0.85rem; font-weight:700; cursor:pointer;">Agregar Proyecto</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#cpr-modal-cancel').addEventListener('click', () => {
        modal.style.display = 'none';
      });

      modal.querySelector('#cpr-modal-submit').addEventListener('click', () => {
        const catSelect = document.getElementById('cpr-modal-cat');
        const fileInput = document.getElementById('cpr-modal-file');
        const category = catSelect.value;
        const catNames = {
          bathrooms: 'Bathrooms',
          kitchens: 'Kitchens',
          interiors: 'Interiors & Flooring',
          exterior: 'Exterior & Additions'
        };

        const file = fileInput.files[0];
        if (!file) {
          alert('Por favor selecciona un archivo de imagen para subir.');
          return;
        }

        compressFile(file, (dataUrl) => {
          if (!siteData.portfolio) siteData.portfolio = { items: [] };
          if (!Array.isArray(siteData.portfolio.items)) siteData.portfolio.items = [];

          const newItem = {
            id: 'p' + Date.now(),
            category: category,
            type: 'image',
            media: dataUrl,
            poster: dataUrl,
            catName: catNames[category] || 'Bathrooms'
          };

          siteData.portfolio.items.unshift(newItem);
          applyContent(siteData);
          notifyStateChange();
          modal.style.display = 'none';
          fileInput.value = '';
        });
      });
    }

    // Preselect current category if viewing filtered view
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = (urlParams.get('cat') || '').toLowerCase();
    const catSelect = document.getElementById('cpr-modal-cat');
    if (catSelect && activeCategory && activeCategory !== 'all') {
      catSelect.value = activeCategory;
    }

    modal.style.display = 'flex';
  }

  function compressFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function openImagePicker(callback) {
    let input = document.getElementById('cpr-hidden-file-input');
    if (!input) {
      input = document.createElement('input');
      input.id = 'cpr-hidden-file-input';
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);
    }

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      compressFile(file, (dataUrl) => {
        callback(dataUrl);
        input.value = '';
      });
    };

    input.click();
  }

  // ================= 5. INITIALIZATION =================
  async function init() {
    let loadedData = null;

    // 1. Purge legacy poisoned caches containing obsolete att.* paths
    try {
      ['cpr_content', 'cpr_content_v2', 'cpr_content_v3', 'cpr_content_v4', 'cpr_content_v5'].forEach((k) => {
        const val = localStorage.getItem(k);
        if (val && val.includes('att.')) {
          localStorage.removeItem(k);
        }
      });

      // Migrate clean v2/legacy data if present
      if (!localStorage.getItem(STORAGE_KEY)) {
        const prev = null; // force fresh load from content.json for new version
        if (prev && !prev.includes('att.')) {
          localStorage.setItem(STORAGE_KEY, prev);
          localStorage.removeItem('cpr_content');
          localStorage.removeItem('cpr_content_v2');
        }
      }

      const localStr = localStorage.getItem(STORAGE_KEY);
      if (localStr) {
        if (localStr.includes('att.')) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          loadedData = JSON.parse(localStr);
        }
      }
    } catch (e) {}

    // 2. Fetch fresh content.json if cache was empty or invalidated
    if (!loadedData) {
      try {
        const res = await fetch('content.json?v=' + Date.now());
        if (res.ok) loadedData = await res.json();
      } catch (err) {}
    }

    // 3. Always sanitize and apply
    applyContent(sanitizeData(loadedData || siteData));

    // Discreet Admin Portal link in footer: ensure strictly only 1 exists
    if (!isInIframe) {
      const allLinks = document.querySelectorAll('.footer-admin, #cpr-admin-footer-link');
      if (allLinks.length > 1) {
        // If more than one exists, keep only the first one and remove extras
        for (let i = 1; i < allLinks.length; i++) {
          allLinks[i].remove();
        }
      } else if (allLinks.length === 0) {
        const footerInfo = document.querySelector('footer .footer-info') || document.querySelector('footer');
        if (footerInfo) {
          const link = document.createElement('p');
          link.className = 'footer-admin';
          link.innerHTML = `<a id="cpr-admin-footer-link" href="admin.html" class="footer-admin-link">🔒 Admin Portal</a>`;
          footerInfo.appendChild(link);
        }
      }
    } else {
      document.querySelectorAll('.footer-admin, #cpr-admin-footer-link').forEach((el) => {
        el.style.display = 'none';
      });
    }
  }

  // ================= 6. MESSAGING WITH ADMIN PORTAL =================
  window.addEventListener('message', (event) => {
    if (!event.data) return;

    if (event.data.type === 'CPR_RESTORE_STATE') {
      if (event.data.payload) applyContent(event.data.payload);
    } else if (event.data.type === 'CPR_ENABLE_INLINE_ADMIN') {
      if (event.data.payload) {
        siteData = deepClone(event.data.payload);
      }
      applyContent(siteData);
    } else if (event.data.type === 'CPR_SAVED_CLEAN') {
      document.querySelectorAll('.cpr-modified').forEach((el) => el.classList.remove('cpr-modified'));
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
