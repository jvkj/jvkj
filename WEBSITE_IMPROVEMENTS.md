# Website Analysis & Improvement Recommendations

**Website**: Recepti od A do Ž (Recipe Collection)
**Analysis Date**: 2026-01-28

---

## Executive Summary

This Slovenian recipe website is a well-structured static PWA with dynamic JavaScript functionality. However, there are several areas where improvements would enhance SEO, accessibility, performance, security, and maintainability.

---

## 1. SEO Issues (High Priority)

### 1.1 Empty Title Tags
**Location**: All HTML files (`index.html:5`, `palacinke_ameriske.html:5`, etc.)
**Issue**: `<title></title>` tags are empty and set dynamically via JavaScript
**Impact**: Search engines may not properly index page titles
**Recommendation**: Set static title tags or use server-side rendering for SEO-critical content

```html
<!-- Current -->
<title></title>

<!-- Recommended -->
<title>Ameriške palačinke - Recepti od A do Ž by JVKJ</title>
```

### 1.2 Missing Meta Descriptions
**Location**: All HTML files
**Issue**: No `<meta name="description">` tags
**Impact**: Search engines will auto-generate snippets, potentially reducing CTR
**Recommendation**: Add unique meta descriptions for each recipe page

```html
<meta name="description" content="Recept za puhaste ameriške palačinke - hitro in enostavno v 20 minutah.">
```

### 1.3 Missing Open Graph & Twitter Cards
**Issue**: No social media preview metadata
**Recommendation**: Add OG and Twitter meta tags for better social sharing

```html
<meta property="og:title" content="Ameriške palačinke">
<meta property="og:description" content="Recept za puhaste ameriške palačinke">
<meta property="og:image" content="images/palacinke_ameriske.jpeg">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
```

### 1.4 Missing Structured Data (Schema.org)
**Issue**: No Recipe schema markup
**Impact**: Recipes won't appear as rich results in Google Search
**Recommendation**: Add JSON-LD structured data for recipes

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Ameriške palačinke",
  "prepTime": "PT10M",
  "cookTime": "PT12M",
  "recipeIngredient": ["386ml mleka", "300g moke", ...],
  "recipeInstructions": [...]
}
</script>
```

---

## 2. Accessibility Issues (High Priority)

### 2.1 Missing Language Attribute
**Location**: All HTML files (`index.html:3`)
**Issue**: `<html>` tag lacks `lang` attribute
**Recommendation**: Add `lang="sl"` for Slovenian

```html
<html lang="sl">
```

### 2.2 Images Missing Alt Text
**Location**: `sidebar.js:199`
**Issue**: `renderPhoto()` function sets empty alt text
**Recommendation**: Add meaningful alt text for all images

```javascript
// Current
span.innerHTML = `<img src="images/${photo}" alt="" />`;

// Recommended
span.innerHTML = `<img src="images/${photo}" alt="${altText}" />`;
```

### 2.3 Form Accessibility
**Location**: Recipe pages (`palacinke_ameriske.html:97-125`)
**Issues**:
- Input field lacks proper `<label>` element
- Button links (`<a>` tags) used instead of actual buttons
- Form has `method="post"` but no backend to handle it

**Recommendations**:
```html
<label for="steviloOseb">Število oseb:</label>
<input type="number" id="steviloOseb" min="1" value="1">
<button type="button" id="minusButton" aria-label="Zmanjšaj količino">-</button>
<button type="button" id="plusButton" aria-label="Povečaj količino">+</button>
```

### 2.4 Custom HTML Elements Without Semantics
**Location**: `main.css:123-131`, recipe pages
**Issue**: Custom elements `<yello>` and `<pomembno>` lack semantic meaning
**Recommendation**: Use `<span>` or `<em>` with appropriate CSS classes

```html
<!-- Current -->
<yello>zažgano maslo je "no bueno"!</yello>

<!-- Recommended -->
<span class="highlight">zažgano maslo je "no bueno"!</span>
```

### 2.5 Color Contrast Issues
**Location**: `main.css:90`
**Issue**: Text color `#7f888f` on background `#151515` may have insufficient contrast
**Recommendation**: Test with WCAG contrast checker and adjust if needed

---

## 3. Performance Improvements (Medium Priority)

### 3.1 Render-Blocking JavaScript
**Location**: All HTML files
**Issue**: jQuery and other scripts loaded at end of body block rendering
**Recommendation**: Consider async/defer loading strategies

```html
<script src="assets/js/jquery.min.js" defer></script>
```

### 3.2 Image Optimization
**Issues**:
- No lazy loading for images
- No responsive images (srcset)
- JPEG images could use modern formats (WebP/AVIF)

**Recommendations**:
```html
<img
  src="images/palacinke_ameriske.jpeg"
  srcset="images/palacinke_ameriske-480.webp 480w,
          images/palacinke_ameriske-800.webp 800w"
  sizes="(max-width: 600px) 480px, 800px"
  loading="lazy"
  alt="Ameriške palačinke">
```

### 3.3 Font Loading Strategy
**Location**: `main.css:2`
**Issue**: Google Fonts loaded via @import (blocking)
**Recommendation**: Use `<link rel="preconnect">` and `<link rel="preload">`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css?family=..." rel="stylesheet">
```

### 3.4 CSS File Size
**Location**: `assets/css/main.css` (2,350+ lines)
**Recommendation**: Consider CSS minification and removing unused styles

---

## 4. Service Worker & PWA Issues (Medium Priority)

### 4.1 Hardcoded Cache Paths
**Location**: `service-worker.js:6-46`
**Issue**: All paths are hardcoded with `/jvkj/` prefix
**Impact**: Won't work if deployed to different URL structure
**Recommendation**: Use relative paths or dynamic path generation

### 4.2 Missing medenjaki.html
**Location**: `service-worker.js`
**Issue**: `medenjaki.html` not included in cache list
**Recommendation**: Add all recipe pages to the cache

### 4.3 Inconsistent Image Paths
**Location**: `service-worker.js:12-17`
**Issue**: Some images use `/jvkj/images/` prefix, others don't
```javascript
'/jvkj/medenjaki.jpeg',           // Missing images/ prefix
'/jvkj/images/palacinke_ameriske.jpeg',  // Has prefix
```

### 4.4 No Cache Versioning Strategy
**Issue**: Cache name is static `'my-pwa-cache-v1'`
**Recommendation**: Implement cache busting for updates

### 4.5 Missing PWA Manifest Fields
**Location**: `manifest.json`
**Recommendation**: Add additional fields for better PWA experience

```json
{
  "description": "Zbirka receptov od A do Ž",
  "scope": "/",
  "orientation": "portrait",
  "categories": ["food", "recipes"],
  "lang": "sl"
}
```

---

## 5. Code Quality Issues

### 5.1 Global Variables
**Location**: All recipe pages
**Issue**: Recipe data defined as global `const` variables in inline scripts
**Recommendation**: Encapsulate in a module or object

```javascript
const recipeData = {
  naslov: "Ameriške palačinke",
  sestavine: {...},
  // ...
};
```

### 5.2 Potential Runtime Errors
**Location**: `custom.js:222-230`
**Issue**: Event listeners attached without checking if elements exist
**Current**:
```javascript
document.getElementById('minusButton').addEventListener('click', ...);
```
**Recommendation**:
```javascript
const minusButton = document.getElementById('minusButton');
if (minusButton) {
  minusButton.addEventListener('click', ...);
}
```

### 5.3 Mixed jQuery and Vanilla JS
**Location**: Throughout JavaScript files
**Recommendation**: Standardize on one approach (preferably vanilla JS for modern browsers)

### 5.4 Duplicate Code in HTML Templates
**Issue**: Recipe pages share nearly identical HTML structure
**Recommendation**: Consider a templating system or static site generator

---

## 6. Security Considerations

### 6.1 Inline Scripts
**Location**: All HTML files
**Issue**: Recipe data embedded in inline `<script>` tags
**Recommendation**: Move data to external JSON files for CSP compliance

### 6.2 Form Without CSRF Protection
**Location**: Recipe pages
**Issue**: Form has `method="post"` but no action/protection
**Recommendation**: Remove form method or implement proper handling

### 6.3 No Content Security Policy
**Recommendation**: Add CSP headers/meta tags

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com">
```

---

## 7. UX Improvements

### 7.1 Disabled Search Feature
**Location**: `index.html:81-85`
**Issue**: Search form is commented out
**Recommendation**: Implement client-side search functionality

### 7.2 Print Stylesheet
**Issue**: No print-optimized styles for recipe printing
**Recommendation**: Add `@media print` styles

### 7.3 Ingredient Checkbox Feature
**Recommendation**: Allow users to check off ingredients while cooking

### 7.4 Recipe Scaling UX
**Issue**: Must click "Preračunaj" button after changing quantity
**Recommendation**: Auto-calculate on input change

```javascript
document.getElementById('steviloOseb').addEventListener('input', multiplyBy);
```

### 7.5 Quantity Input Validation
**Location**: `palacinke_ameriske.html:107`
**Issue**: Text input allows non-numeric values
**Recommendation**: Use `type="number"` with `min="1"`

---

## 8. Maintenance Issues

### 8.1 Outdated Copyright Year Handling
**Location**: `index.html:95`
**Issue**: Hardcoded year "© 2025"
**Recommendation**: Generate dynamically

```javascript
document.getElementById('year').textContent = new Date().getFullYear();
```

### 8.2 Dead/Commented Code
**Location**: `articles.js:20-37`
**Issue**: Commented-out recipe entries
**Recommendation**: Remove or use a proper "draft" system

---

## Priority Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Empty title tags | High | Low | **P1** |
| Missing meta descriptions | High | Low | **P1** |
| Missing lang attribute | Medium | Low | **P1** |
| Missing Schema.org markup | High | Medium | **P1** |
| Service worker path issues | High | Medium | **P2** |
| Image optimization | Medium | Medium | **P2** |
| Form accessibility | Medium | Low | **P2** |
| Code organization | Medium | High | **P3** |
| Print stylesheet | Low | Low | **P3** |
| Search implementation | Low | High | **P4** |

---

## Quick Wins (Can Be Done Immediately)

1. Add `lang="sl"` to all HTML files
2. Add static title tags
3. Add meta descriptions
4. Fix service worker cache paths
5. Add `loading="lazy"` to images
6. Change form input to `type="number"`
7. Add missing alt text to images
8. Add preconnect hints for Google Fonts

---

## Conclusion

The website has a solid foundation with good responsive design and PWA capabilities. The highest priority improvements should focus on SEO (titles, meta descriptions, structured data) and accessibility (language attribute, form accessibility). Performance optimizations like image lazy loading and font loading strategies would provide noticeable improvements with minimal effort.
