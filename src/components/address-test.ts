/**
 * Test untuk memastikan fungsi parseAddress bekerja dengan benar
 * sesuai dengan contoh yang diberikan user
 */

// Contoh fungsi yang sama dengan yang ada di InvoicePreview.tsx
const parseAddress = (fullAddress: string) => {
  const kelurahanMatch = fullAddress.match(/,\s*([^,]+),\s*Kec\.\s*([^,]+)/);
  if (kelurahanMatch) {
    const kelurahan = kelurahanMatch[1].trim();
    const kecamatan = kelurahanMatch[2].trim();
    return {
      detail: `${kelurahan}, Kec. ${kecamatan}`,
      point: fullAddress.trim()
    };
  }
  
  // Fallback jika tidak menemukan pattern yang sesuai
  const parts = fullAddress.split(',');
  if (parts.length >= 3) {
    const lastTwoParts = parts.slice(-3, -1).map(p => p.trim());
    return {
      detail: lastTwoParts.join(', '),
      point: fullAddress.trim()
    };
  }
  
  return {
    detail: fullAddress.trim(),
    point: fullAddress.trim()
  };
};

// Test cases
const testCases = [
  {
    input: "Jl. Bojong Koneng Atas Jl. Pager Sari, Cibeunying, Kec. Cimenyan, Kabupaten Bandung, Jawa Barat 40191",
    expected: {
      detail: "Cibeunying, Kec. Cimenyan",
      point: "Jl. Bojong Koneng Atas Jl. Pager Sari, Cibeunying, Kec. Cimenyan, Kabupaten Bandung, Jawa Barat 40191"
    }
  },
  {
    input: "Jl. Banten, Kebonwaru, Kec. Batununggal, Kota Bandung, Jawa Barat 40272, Indonesia",
    expected: {
      detail: "Kebonwaru, Kec. Batununggal",
      point: "Jl. Banten, Kebonwaru, Kec. Batununggal, Kota Bandung, Jawa Barat 40272, Indonesia"
    }
  },
  {
    input: "Jl. Sudirman No. 45, Menteng, Kec. Menteng, Jakarta Pusat 10350",
    expected: {
      detail: "Menteng, Kec. Menteng",
      point: "Jl. Sudirman No. 45, Menteng, Kec. Menteng, Jakarta Pusat 10350"
    }
  }
];

// Run tests
console.log("=== Testing parseAddress function ===\n");

testCases.forEach((test, index) => {
  const result = parseAddress(test.input);
  const detailMatch = result.detail === test.expected.detail;
  const pointMatch = result.point === test.expected.point;
  
  console.log(`Test ${index + 1}: ${detailMatch && pointMatch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Input: ${test.input}`);
  console.log(`Expected detail: "${test.expected.detail}"`);
  console.log(`Got detail: "${result.detail}"`);
  console.log(`Expected point: "${test.expected.point}"`);
  console.log(`Got point: "${result.point}"`);
  console.log('');
});

// Export untuk digunakan di tempat lain
export { parseAddress };