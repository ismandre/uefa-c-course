<script setup>
// No special logic needed for About page
</script>

<template>
  <div class="about-container">
    <div class="about-content">
      <h1>O aplikaciji</h1>

      <section class="intro-section">
        <p>
          Ova aplikacija je napravljena kako bi pomogla kandidatima UEFA C nogometne trenerske
          licence u pripremi za ispit. Pruža centralizirano mjesto za pristup materijalima s tečaja
          te sustav kvizova za vježbanje pitanja.
        </p>
      </section>

      <section class="features-section">
        <h2>Glavne funkcionalnosti</h2>
        <ul>
          <li>
            <strong>Pregled predmeta</strong> - Pristupite svim materijalima (prezentacije,
            bilješke, video snimke) organiziranim po predmetima
          </li>
          <li>
            <strong>Sustav kvizova</strong> - Vježbajte pitanja s automatskim ocjenjivanjem za
            pitanja višestrukog izbora i samoprocjenom za otvorena pitanja
          </li>
          <li>
            <strong>Praćenje napretka</strong> - Pregledajte svoju povijest odgovora za svako
            pitanje, uključujući točnost i vrijeme odgovora
          </li>
          <li>
            <strong>Lokalno pohranjena povijest</strong> - Svi vaši pokušaji se spremaju lokalno u
            pregledniku i dostupni su i nakon zatvaranja stranice
          </li>
          <li>
            <strong>Nasumični redoslijed pitanja</strong> - Svaka sesija kviza generira pitanja u
            slučajnom redoslijedu za bolju pripremu
          </li>
        </ul>
      </section>

      <section class="disclaimer-section">
        <h2>Odricanje odgovornosti</h2>
        <div class="disclaimer-box">
          <p>
            <strong>Ova aplikacija je neslužbena i nije povezana s UEFA-om ili HNS-om.</strong>
          </p>
          <p>
            Svi materijali, pitanja i odgovori prikupljeni su iz javno dostupnih izvora i osobnih
            bilješki s tečaja. Autor ne jamči potpunu točnost informacija i odgovora prikazanih u
            aplikaciji.
          </p>
          <p>
            Korištenje ove aplikacije je isključivo na vlastitu odgovornost. Autor ne preuzima
            nikakvu odgovornost za eventualne netočnosti, greške ili posljedice korištenja
            informacija iz aplikacije.
          </p>
          <p>
            Za službene informacije i materijale, molimo obratite se svom predavaču ili službenim
            izvorima HNS-a.
          </p>
        </div>
      </section>

      <section class="contact-section">
        <h2>Kontakt i povratne informacije</h2>
        <p>
          Imate prijedlog za poboljšanje? Primijetili grešku u pitanjima ili odgovorima? Slobodno mi
          se javite!
        </p>
        <div class="contact-box">
          <p>
            <strong>Email:</strong>
            <span class="contact-placeholder">ismarkoandre@gmail.com</span>
          </p>
          <p class="contact-note">
            Cijenimo sve povratne informacije i prijedloge koji mogu pomoći u poboljšanju kvalitete
            aplikacije za sve kandidate.
          </p>
        </div>
      </section>

      <section class="footer-section">
        <p class="version-info">Verzija 0.1 | Siječanj 2026</p>
        <RouterLink to="/" class="back-link">← Povratak na početnu</RouterLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.about-content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

h2 {
  color: #2c3e50;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

section {
  margin-bottom: 2rem;
}

.intro-section p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #606060;
}

.features-section ul {
  list-style: none;
  padding: 0;
}

.features-section li {
  padding: 1rem;
  margin-bottom: 0.75rem;
  background-color: #f8f9fa;
  border-left: 4px solid #42b983;
  border-radius: 4px;
  line-height: 1.6;
}

.features-section strong {
  color: #2c3e50;
  display: block;
  margin-bottom: 0.25rem;
}

.disclaimer-section {
  margin-top: 3rem;
}

.disclaimer-box {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1.5rem;
  line-height: 1.7;
}

.disclaimer-box p {
  margin-bottom: 1rem;
  color: #856404;
}

.disclaimer-box p:last-child {
  margin-bottom: 0;
}

.disclaimer-box strong {
  color: #856404;
  font-size: 1.05rem;
}

.contact-section {
  margin-top: 3rem;
}

.contact-section > p {
  line-height: 1.7;
  color: #606060;
  margin-bottom: 1rem;
}

.contact-box {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  padding: 1.5rem;
}

.contact-box p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #1565c0;
}

.contact-box p:last-child {
  margin-bottom: 0;
}

.contact-placeholder {
  display: inline-block;
  background-color: #bbdefb;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-family: monospace;
  margin-left: 0.5rem;
}

.contact-note {
  font-size: 0.95rem;
  font-style: italic;
}

.footer-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
  text-align: center;
}

.version-info {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #359268;
}
</style>
