#!/bin/bash

# Quick Smoke Test Script for Insurance Site
# Run this after deployments to verify everything works

DOMAIN="https://safora.namastebostonhomes.com"
echo "🧪 Testing: $DOMAIN"
echo "================================"

# Test 1: Homepage loads
echo -n "✓ Homepage (200 OK): "
status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/)
if [ "$status" -eq 200 ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (Status: $status)"
fi

# Test 2: Compare page loads
echo -n "✓ Compare page (200 OK): "
status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/compare)
if [ "$status" -eq 200 ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (Status: $status)"
fi

# Test 3: Scan page loads
echo -n "✓ Scan page (200 OK): "
status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/scan)
if [ "$status" -eq 200 ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (Status: $status)"
fi

# Test 4: Privacy page loads
echo -n "✓ Privacy page (200 OK): "
status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/privacy)
if [ "$status" -eq 200 ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (Status: $status)"
fi

# Test 5: Terms page loads
echo -n "✓ Terms page (200 OK): "
status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/terms)
if [ "$status" -eq 200 ]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (Status: $status)"
fi

# Test 6: HTTPS redirect works
echo -n "✓ HTTP → HTTPS redirect: "
redirect=$(curl -s -o /dev/null -w "%{redirect_url}" http://safora.namastebostonhomes.com/)
if [[ "$redirect" == https* ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL (No HTTPS redirect)"
fi

# Test 7: Google Analytics script present
echo -n "✓ Google Analytics installed: "
if curl -s $DOMAIN/ | grep -q "gtag"; then
  echo "✅ PASS"
else
  echo "❌ FAIL (gtag not found)"
fi

# Test 8: Check security headers
echo -n "✓ HSTS header present: "
if curl -s -I $DOMAIN/ | grep -q "strict-transport-security"; then
  echo "✅ PASS"
else
  echo "⚠️  WARNING (HSTS header missing)"
fi

# Test 9: API endpoint exists (should require POST)
echo -n "✓ Policy scanner API exists: "
status=$(curl -s -o /dev/null -w "%{http_code}" -X GET $DOMAIN/api/ai/policy-scanner)
if [ "$status" -eq 405 ] || [ "$status" -eq 400 ]; then
  echo "✅ PASS (rejects GET as expected)"
else
  echo "⚠️  WARNING (Status: $status)"
fi

# Test 10: Check if site is fast
echo -n "✓ Homepage load time: "
load_time=$(curl -s -o /dev/null -w "%{time_total}" $DOMAIN/)
if (( $(echo "$load_time < 2.0" | bc -l) )); then
  echo "✅ PASS (${load_time}s)"
else
  echo "⚠️  SLOW (${load_time}s)"
fi

echo "================================"
echo "✅ Smoke test complete!"
echo ""
echo "Next steps:"
echo "1. Test file upload: $DOMAIN/scan"
echo "2. Test form submission: $DOMAIN/compare"
echo "3. Check Google Analytics: https://analytics.google.com/"
echo "4. Test on mobile device"
echo ""
echo "See DATA_ACCURACY_TESTING.md for detailed test plan"
