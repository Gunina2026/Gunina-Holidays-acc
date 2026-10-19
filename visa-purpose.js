(() => {
  'use strict';
  const countrySelect = document.getElementById('visa-country');
  const purposeSelect = document.getElementById('visa-purpose');
  const data = window.VISA_CHECKLIST_DATA;
  const countries = window.VISAS;
  const result = document.getElementById('purpose-result');
  const items = document.getElementById('checklist-items');
  let selectedCountry, selectedPurpose;
  countries.forEach(country => countrySelect.add(new Option(country.name, country.slug)));
  data.purposes.forEach(purpose => purposeSelect.add(new Option(purpose.name, purpose.slug)));
  const query = new URLSearchParams(location.search);
  countrySelect.value = query.get('country') || '';
  purposeSelect.value = query.get('purpose') || '';
  function progress() {
    const checked = items.querySelectorAll('input:checked').length;
    document.getElementById('checklist-progress').textContent = `${checked} of ${items.querySelectorAll('input').length} preparation items ticked. Ticks reset when you change your selection or reload.`;
  }
  function addGroup(title, rows) {
    const heading = document.createElement('h3'); heading.textContent = title; items.append(heading);
    rows.forEach(row => {
      const label = document.createElement('label'); label.className = 'place-choice';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
      const text = document.createElement('span'); text.textContent = row;
      label.append(checkbox, text); items.append(label);
    });
  }
  function render() {
    selectedCountry = countries.find(country => country.slug === countrySelect.value);
    selectedPurpose = data.purposes.find(purpose => purpose.slug === purposeSelect.value);
    result.hidden = !selectedCountry || !selectedPurpose;
    document.getElementById('checklist-prompt').hidden = !result.hidden;
    const url = new URL(location.href);
    ['country', 'purpose'].forEach((key, index) => {
      const value = [countrySelect.value, purposeSelect.value][index];
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    });
    history.replaceState(null, '', url);
    items.replaceChildren();
    if (result.hidden) return;
    document.getElementById('checklist-title').textContent = `${selectedCountry.name} · ${selectedPurpose.name}`;
    document.getElementById('checklist-notice').textContent = data.notice;
    const download = document.getElementById('purpose-pdf');
    download.href = selectedPurpose.pdf;
    download.download = `Gunina-${selectedPurpose.slug}-preparation-checklist.pdf`;
    download.setAttribute('aria-label', `Download ${selectedPurpose.name} preparation checklist PDF`);
    const enquiry = new URLSearchParams({destination: selectedCountry.name, service: 'Visa Assistance', purpose: selectedPurpose.name});
    document.getElementById('purpose-enquiry').href = '/enquiry/?' + enquiry;
    addGroup('Core preparation', data.common);
    addGroup('For this travel purpose', selectedPurpose.items);
    addGroup('Traveller circumstances — use the items that apply', data.profiles);
    addGroup('Before you apply', ['Confirm the correct visa route and its official document checklist for your nationality, residence and intended activities.', 'Check names, passport numbers, dates and document consistency before submission.']);
    progress();
  }
  const sources = document.getElementById('checklist-sources');
  data.sources.forEach(source => {
    const item = document.createElement('li'), link = document.createElement('a');
    link.href = source.url; link.textContent = source.label; link.target = '_blank'; link.rel = 'noopener';
    item.append(link); sources.append(item);
  });
  countrySelect.addEventListener('change', render);
  purposeSelect.addEventListener('change', render);
  items.addEventListener('change', progress);
  document.getElementById('reset-checklist').addEventListener('click', () => {items.querySelectorAll('input').forEach(input => input.checked = false);progress();});
  render();
})();
