# Data Accuracy & Testing Plan

## Testing Status: 🟡 In Progress

### Production URLs
- ✅ Vercel: https://insurance-4nk2ai5zt-sanjeevs-projects-e08bbbfb.vercel.app
- ✅ Custom Domain: https://safora.namastebostonhomes.com

---

## Phase 1: AI Policy Scanner Accuracy Testing

### Test Cases for Policy Upload

#### Test 1: GEICO Auto Policy
**Goal**: Verify AI extracts correct data from a GEICO policy

**Test Data Needed**:
- [ ] Sample GEICO auto policy PDF
- [ ] Known correct values (premium, deductible, coverage limits)

**What to Test**:
```
Expected Extractions:
- Carrier Name: "GEICO"
- Policy Number: [exact number from PDF]
- Premium: $XXX/month or $XXX/year
- Deductible: $XXX
- Liability Limits: XX/XX/XX format
- Collision Coverage: Yes/No
- Comprehensive Coverage: Yes/No
```

**Pass Criteria**: 95%+ accuracy on all fields

---

#### Test 2: Progressive Auto Policy
**Test Data**: Progressive policy document

**What to Test**:
- Premium amount accuracy
- Coverage type detection
- Deductible extraction
- Discount identification

---

#### Test 3: State Farm Home Policy
**Test Data**: State Farm homeowners policy

**What to Test**:
- Dwelling coverage amount
- Liability limit
- Deductible (wind/hail vs all other perils)
- Personal property coverage
- Loss of use coverage

---

#### Test 4: Lemonade Renters Policy
**Test Data**: Digital-first carrier policy

**What to Test**:
- JSON/modern format parsing
- Personal property limit
- Liability coverage
- Deductible

---

#### Test 5: Edge Cases

**5a. Scanned/Low Quality PDF**
- [ ] Upload blurry/scanned policy
- [ ] Check if AI can still extract data
- [ ] Verify confidence score reflects quality

**5b. Multi-Page Policy (10+ pages)**
- [ ] Upload comprehensive policy packet
- [ ] Verify all pages are processed
- [ ] Check processing time (<30 seconds)

**5c. Handwritten Notes on Policy**
- [ ] Policy with handwritten annotations
- [ ] AI should ignore notes, extract printed data

**5d. Non-English Policy**
- [ ] Upload Spanish policy (if applicable to MA market)
- [ ] Should either reject or handle gracefully

**5e. Expired Policy**
- [ ] Old policy from 2023
- [ ] Should detect and flag expiration date

---

## Phase 2: Quote Comparison Accuracy

### Test Cases for Quote Display

#### Test 6: Carrier Rate Verification
**Goal**: Ensure displayed quotes match real carrier rates

**Manual Testing Required**:
1. Get real quotes from 3 carriers for same profile:
   - GEICO
   - Progressive  
   - State Farm

2. Compare with mock data in `/src/app/compare/page.tsx`

3. Verify markup/commission display:
   ```
   If carrier quote = $1,200/year
   And commission = 10%
   Display should show: $1,200/year + $120 commission disclosed
   ```

---

#### Test 7: Discount Detection
**Goal**: Verify AI identifies applicable discounts

**Test Profile**:
```
Driver: Age 32, clean record, homeowner
Vehicle: 2019 Honda Civic, anti-theft system
Current Premium: $2,400/year
```

**Expected Discounts Identified**:
- [ ] Multi-policy (if bundling available)
- [ ] Good driver discount
- [ ] Anti-theft device discount
- [ ] Homeowner discount
- [ ] Low mileage (if applicable)

**Pass Criteria**: Identifies 80%+ of applicable discounts

---

#### Test 8: Coverage Gap Analysis
**Goal**: AI detects insufficient coverage

**Test Scenarios**:

**8a. Underinsured Motorist**
- Home value: $800K
- Liability limit: $100K
- **Expected**: AI flags massive gap, recommends umbrella

**8b. Low Deductible on Old Car**
- Vehicle: 2010 Honda (value $5K)
- Deductible: $250
- **Expected**: AI suggests raising to $1,000 to save premium

**8c. Missing Coverage**
- Homeowner without flood insurance in flood zone
- **Expected**: AI recommends flood policy

---

## Phase 3: Form Validation Testing

### Test 9: Quote Request Form (`/compare`)

**Valid Input Tests**:
- [ ] All required fields filled correctly
- [ ] Valid email format
- [ ] Valid phone format (US)
- [ ] Valid ZIP code (MA, NH, RI)
- [ ] Age 18+ validation

**Invalid Input Tests**:
- [ ] Missing required fields → Show error
- [ ] Invalid email → Show error
- [ ] Invalid ZIP → Show error
- [ ] Age <18 → Show error or warning
- [ ] Special characters in name → Handle gracefully

**Edge Cases**:
- [ ] Paste garbage text into fields
- [ ] SQL injection attempt in form fields
- [ ] XSS attempt `<script>alert('test')</script>`

---

### Test 10: File Upload Validation (`/scan`)

**Valid Upload Tests**:
- [ ] PDF file (5 MB) → Processes successfully
- [ ] JPEG/PNG image of policy → Processes successfully
- [ ] Multi-page PDF (20 pages) → Processes successfully

**Invalid Upload Tests**:
- [ ] File too large (>10 MB) → Reject with clear error
- [ ] Wrong file type (.exe, .zip) → Reject
- [ ] Corrupted PDF → Handle gracefully
- [ ] No file selected → Show error

**Security Tests**:
- [ ] Malicious PDF upload → Sandboxed processing
- [ ] File name with special chars → Sanitized
- [ ] Verify file deletion after 90 days (check code logic)

---

## Phase 4: Mobile Responsiveness Testing

### Test 11: Mobile Device Testing

**Devices to Test**:
- [ ] iPhone 15 Pro (iOS 18) - Safari
- [ ] iPhone SE (small screen) - Safari
- [ ] Samsung Galaxy S24 - Chrome
- [ ] iPad Pro - Safari
- [ ] Android tablet - Chrome

**Test Each Page**:
- [ ] Homepage → All sections readable
- [ ] Compare page → Form usable on mobile
- [ ] Scan page → File upload works on mobile
- [ ] Privacy page → Text readable, scrollable
- [ ] Terms page → Text readable, scrollable

**Mobile-Specific Issues**:
- [ ] Touch targets >44x44px
- [ ] No horizontal scrolling
- [ ] Forms don't zoom on focus
- [ ] Buttons easily tappable
- [ ] Images load properly

---

## Phase 5: Performance Testing

### Test 12: Load Time Testing

**Tools**: Google PageSpeed Insights, Lighthouse

**Metrics to Check**:
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms

**Test URLs**:
```bash
# Homepage
https://safora.namastebostonhomes.com/

# Compare page
https://safora.namastebostonhomes.com/compare

# Scan page
https://safora.namastebostonhomes.com/scan
```

---

### Test 13: API Response Times

**Policy Scanner API** (`/api/ai/policy-scanner`):
- [ ] Upload 1 MB PDF → Response time <5s
- [ ] Upload 5 MB PDF → Response time <10s
- [ ] Upload 10 MB PDF → Response time <15s

**Error Handling**:
- [ ] OpenAI API timeout → Clear error message
- [ ] Invalid API key → Clear error message
- [ ] Rate limit hit → Retry logic works

---

## Phase 6: Security Testing

### Test 14: Security Checklist

**Environment Variables**:
- [ ] No API keys in client-side code
- [ ] `.env` file in `.gitignore`
- [ ] Vercel environment variables encrypted

**HTTPS**:
- [ ] All pages force HTTPS redirect
- [ ] Valid SSL certificate on custom domain
- [ ] No mixed content warnings

**Headers**:
```bash
# Check security headers
curl -I https://safora.namastebostonhomes.com/

# Should include:
# - Strict-Transport-Security
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY or SAMEORIGIN
```

**File Upload Security**:
- [ ] Files scanned for malware (if applicable)
- [ ] Files stored securely
- [ ] Files auto-deleted after 90 days
- [ ] No directory traversal vulnerabilities

---

## Phase 7: Analytics Verification

### Test 15: Google Analytics Tracking

**Real-Time Tracking**:
1. Open: https://analytics.google.com/
2. Go to: Realtime → Overview
3. Visit each page on your site
4. Verify events appear:
   - [ ] Homepage pageview
   - [ ] Compare page pageview
   - [ ] Scan page pageview
   - [ ] Button clicks (if event tracking added)

**Verify Tracking Code**:
```bash
# Check if GA script loads
curl -s https://safora.namastebostonhomes.com/ | grep "gtag"
# Should see: gtag('config', 'G-PXQ6PGV4P9')
```

---

## Phase 8: Legal Compliance Testing

### Test 16: Privacy & Legal Pages

**Privacy Policy** (`/privacy`):
- [ ] Mentions AI/GPT-4 Vision usage
- [ ] Explains data retention (90 days)
- [ ] Lists third-party services (OpenAI, Vercel, Supabase)
- [ ] CCPA compliance language present
- [ ] Contact information provided

**Terms of Service** (`/terms`):
- [ ] "Not an insurance company" disclaimer prominent
- [ ] Commission disclosure clear
- [ ] AI analysis disclaimer present
- [ ] FTC affiliate disclosure present
- [ ] Arbitration clause (if applicable)

**Footer Disclaimers**:
- [ ] Insurance licensing disclaimer visible on all pages
- [ ] Commission disclosure box present
- [ ] AI analysis disclaimer present

---

## Phase 9: Cross-Browser Testing

### Test 17: Browser Compatibility

**Desktop Browsers**:
- [ ] Chrome (latest) - macOS
- [ ] Safari (latest) - macOS
- [ ] Firefox (latest) - macOS
- [ ] Chrome - Windows 11
- [ ] Edge - Windows 11

**Mobile Browsers**:
- [ ] Safari - iOS 18
- [ ] Chrome - iOS 18
- [ ] Chrome - Android 14
- [ ] Samsung Internet - Android

**Test on Each Browser**:
- [ ] Homepage renders correctly
- [ ] Forms work (compare, scan)
- [ ] File upload works
- [ ] Navigation works
- [ ] No console errors

---

## Phase 10: End-to-End User Journey Testing

### Test 18: Complete User Flow #1 (Compare Quotes)

**Scenario**: New user looking for auto insurance

**Steps**:
1. [ ] Land on homepage
2. [ ] Click "Compare Quotes" button
3. [ ] Fill out quote form with valid data
4. [ ] Submit form
5. [ ] View quote results
6. [ ] Click on a carrier quote
7. [ ] Verify commission disclosure shown
8. [ ] Click "Get This Quote" (external link)

**Expected**: Smooth flow, no errors, all data displayed correctly

---

### Test 19: Complete User Flow #2 (Policy Scan)

**Scenario**: Existing policyholder checking for savings

**Steps**:
1. [ ] Land on homepage
2. [ ] Click "Scan Your Policy" button
3. [ ] Upload valid policy PDF
4. [ ] Wait for AI analysis (<30 seconds)
5. [ ] View analysis results:
   - Current coverage details
   - Identified savings opportunities
   - Coverage gap warnings
   - Recommended actions
6. [ ] Click "Compare Better Rates"
7. [ ] See pre-filled quote form with policy data

**Expected**: AI accurately extracts data, provides actionable insights

---

## Test Execution Tracking

### High Priority Tests (Do First)
- [ ] Test 1: GEICO Auto Policy (AI accuracy)
- [ ] Test 6: Carrier Rate Verification (quote accuracy)
- [ ] Test 8: Coverage Gap Analysis (AI recommendations)
- [ ] Test 11: Mobile Device Testing (mobile responsive)
- [ ] Test 14: Security Checklist (security basics)
- [ ] Test 15: Google Analytics Tracking (analytics working)

### Medium Priority Tests
- [ ] Test 9: Form Validation
- [ ] Test 10: File Upload Validation
- [ ] Test 12: Load Time Testing
- [ ] Test 16: Legal Compliance
- [ ] Test 17: Cross-Browser Testing

### Low Priority Tests (Nice to Have)
- [ ] Test 3-5: Additional policy types
- [ ] Test 13: API Response Times
- [ ] Test 18-19: End-to-End Flows

---

## Bug Tracking Template

When you find issues, document them like this:

```markdown
### Bug #1: [Short Description]
**Priority**: High/Medium/Low
**Page**: /compare
**Browser**: Chrome 120 on macOS
**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected**: What should happen
**Actual**: What actually happens
**Screenshot**: [if applicable]
**Fix Required**: Description of fix needed
**Status**: 🔴 Open | 🟡 In Progress | 🟢 Fixed
```

---

## Sample Test Data Sets

### Test Profile #1: Young Driver
```
Name: Sarah Martinez
Age: 25
Location: Boston, MA 02108
Vehicle: 2020 Toyota Camry
Driving Record: 1 speeding ticket (2 years ago)
Current Premium: $2,800/year
```

### Test Profile #2: Family with Home
```
Name: John Chen
Age: 42
Location: Worcester, MA 01608
Vehicles: 2019 Honda Odyssey, 2021 Tesla Model 3
Home: $650K value
Driving Record: Clean
Current Premium: Auto $3,200/year, Home $1,800/year
```

### Test Profile #3: Senior Citizen
```
Name: Margaret O'Brien
Age: 68
Location: Cambridge, MA 02138
Vehicle: 2018 Subaru Outback
Driving Record: Clean (40+ years)
Low mileage: 5,000 miles/year
Current Premium: $1,200/year
```

---

## Next Steps After Testing

1. **Fix Critical Bugs**: Any security or data accuracy issues
2. **Optimize Performance**: If load times >3 seconds
3. **Improve UX**: Based on usability issues found
4. **Add Missing Features**: If gaps identified
5. **Beta Launch**: Invite 10-20 friends/family to test
6. **Collect Feedback**: Create Google Form for beta testers
7. **Iterate**: Fix issues before public launch

---

**Testing Started**: [Date]
**Testing Completed**: [Date]
**Bugs Found**: [Count]
**Critical Issues**: [Count]
**Status**: 🟡 In Progress

