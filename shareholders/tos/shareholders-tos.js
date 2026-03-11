// Shareholders ToS JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Language switcher functionality
    const languageButtons = document.querySelectorAll('.lang-btn');
    const contents = document.querySelectorAll('.rules-content');
    const downloads = document.querySelectorAll('[id^="download-"]');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content sections
            contents.forEach(content => content.classList.add('hidden'));
            
            // Hide all download sections
            downloads.forEach(download => download.classList.add('hidden'));
            
            // Show target content
            const targetContent = document.getElementById(`content-${targetLang}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
            
            // Show target download section
            const targetDownload = document.getElementById(`download-${targetLang}`);
            if (targetDownload) {
                targetDownload.classList.remove('hidden');
            }
        });
    });
});

// Function to switch to Polish version
function switchToPolish() {
    // Find and trigger click on Polish language button
    const polishBtn = document.querySelector('[data-lang="pl"]');
    if (polishBtn) {
        polishBtn.click();
        // Smooth scroll to top of content
        document.querySelector('.page-header').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Toggle full document display
function toggleFullDocument() {
    const fullDocument = document.getElementById('full-rules');
    const expandBtn = document.querySelector('.expand-btn');
    
    if (fullDocument.classList.contains('hidden')) {
        // Show full document
        fullDocument.classList.remove('hidden');
        expandBtn.textContent = '📖 Ukryj pełny regulamin';
        
        // Load the full content from the TXT file
        loadFullRules();
        
        // Smooth scroll to the full document
        setTimeout(() => {
            fullDocument.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    } else {
        // Hide full document
        fullDocument.classList.add('hidden');
        expandBtn.textContent = '📖 Pokaż pełny regulamin';
        
        // Scroll back to the expand button
        expandBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Load and display full rules
async function loadFullRules() {
    const fullDocument = document.getElementById('full-rules');
    
    try {
        // Complete remaining sections §7-§25
        const remainingSections = `
            <section class="rule-section">
                <h2>§7. Wypłata zysków</h2>
                <div class="rule-content">
                    <p>Rozliczenie zysków odbywa się <strong>raz w roku</strong>.</p>
                    <p>Wypłata następuje do końca marca każdego roku.</p>
                    <p>Rok rozliczeniowy trwa od 1 kwietnia do 31 marca.</p>
                    
                    <div class="warning-box">
                        <p><strong>Warunki wypłaty zysku:</strong></p>
                        <p>Prawo do wypłaty zysku przysługuje tylko osobom, które:</p>
                        <ul>
                            <li>posiadały akcje przez minimum <strong>256 dni</strong> w danym roku rozliczeniowym, liczonych od dnia następującego po dniu zakupu akcji,</li>
                            <li>wyrównały zaległe wpłaty kosztowe obejmujące okres sprzed nabycia akcji.</li>
                        </ul>
                        <p>W obu przypadkach posiadacz akcji nie może posiadać zaległości ani opóźnień w płatnościach.</p>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§8. Opóźnienia w płatnościach</h2>
                <div class="rule-content">
                    <p>Jeżeli płatność zostanie dokonana do 12 godzin po upływie terminu, wraz z uzasadnieniem, nie zostanie naliczona opłata dodatkowa.</p>
                    
                    <div class="info-box">
                        <p><strong>Opłaty za opóźnienia:</strong></p>
                        <ul>
                            <li><strong>12–24 godziny po terminie bez usprawiedliwienia</strong> – naliczana jest opłata dodatkowa w wysokości 20% kwoty,</li>
                            <li><strong>12–24 godziny po terminie z usprawiedliwieniem</strong> – opłata dodatkowa wynosi 10% kwoty.</li>
                        </ul>
                    </div>
                    
                    <div class="warning-box">
                        <p><strong>⚠️ UWAGA:</strong></p>
                        <p>Po 24 godzinach od terminu płatności dług zwiększa się o <strong>5% za każde rozpoczęte 24 godziny</strong>.</p>
                    </div>
                    
                    <p>Usprawiedliwienie wynikające z ważnych sytuacji życiowych lub zdrowotnych może skutkować obniżeniem lub anulowaniem opłat dodatkowych.</p>
                </div>
            </section>

            <section class="rule-section">
                <h2>§9. Utrata akcji</h2>
                <div class="rule-content">
                    <div class="warning-box">
                        <p><strong>🚨 UTRATA AKCJI:</strong></p>
                        <p>Jeżeli posiadacz akcji nie opłaci kosztów ani nie przedstawi usprawiedliwienia w ciągu <strong>7 dni (168 godzin)</strong> od upływu terminu, traci wszystkie posiadane akcje.</p>
                    </div>
                    
                    <p><strong>Utrata akcji powoduje:</strong></p>
                    <ul>
                        <li>brak rekompensaty,</li>
                        <li>utratę prawa do zysków,</li>
                        <li>utratę prawa do wypłaty zaległych zysków.</li>
                    </ul>
                    
                    <p><strong>Osoba taka może zostać:</strong></p>
                    <ul>
                        <li>trwale pozbawiona możliwości ponownego zakupu akcji,</li>
                        <li>czasowo lub trwale zablokowana w usługach projektu Bezejmeny, w tym na serwerze Minecraft.</li>
                    </ul>
                </div>
            </section>

            <section class="rule-section">
                <h2>§10. Charakter projektu</h2>
                <div class="rule-content">
                    <p>Projekt Bezejmeny jest nierejestrowaną inicjatywą prywatną prowadzoną pomiędzy osobami fizycznymi.</p>
                    <p>Akcje mają charakter umowy współfinansowania projektu, a nie instrumentu finansowego w rozumieniu przepisów rynku kapitałowego.</p>
                    <p>Organizatorzy nie prowadzą działalności giełdowej ani publicznego obrotu udziałami.</p>
                </div>
            </section>

            <section class="rule-section">
                <h2>§11. Zamknięcie projektu</h2>
                <div class="rule-content">
                    <p>Organizatorzy zastrzegają sobie prawo do zamknięcia serwera lub zakończenia projektu w dowolnym momencie.</p>
                    
                    <p><strong>W przypadku zakończenia działalności projektu:</strong></p>
                    <ul>
                        <li>serwer przestaje generować przychody,</li>
                        <li>nie powstaje zysk do podziału.</li>
                    </ul>
                    
                    <div class="warning-box">
                        <p><strong>⚠️ WAŻNE:</strong></p>
                        <p>Wypłaty dla posiadaczy akcji realizowane są wyłącznie z rzeczywiście wypracowanego zysku, dlatego w przypadku zamknięcia projektu nie przysługuje zwrot poniesionych kosztów ani odszkodowanie.</p>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§12. Brak gwarancji zysku</h2>
                <div class="rule-content">
                    <p>Nabycie akcji projektu nie stanowi inwestycji gwarantującej zysk.</p>
                    <p>Organizatorzy nie gwarantują osiągnięcia przychodów ani zysków przez projekt.</p>
                    <p>Posiadacze akcji są świadomi, że projekt może generować brak zysków lub straty, a w takim przypadku nie przysługuje żadna rekompensata finansowa.</p>
                </div>
            </section>

            <section class="rule-section">
                <h2>§13. Brak odpowiedzialności za zdarzenia niezależne</h2>
                <div class="rule-content">
                    <p>Organizatorzy nie ponoszą odpowiedzialności za przerwy w działaniu projektu wynikające z przyczyn niezależnych, w szczególności:</p>
                    <ul>
                        <li>awarii technicznych,</li>
                        <li>problemów z hostingiem,</li>
                        <li>działań osób trzecich,</li>
                        <li>ataków sieciowych (np. DDoS),</li>
                        <li>zmian zasad gry Minecraft lub decyzji Mojang / Microsoft.</li>
                    </ul>
                    <p>Zdarzenia te nie stanowią podstawy do roszczeń finansowych wobec organizatorów.</p>
                </div>
            </section>

            <section class="rule-section">
                <h2>§14. Zrzeczenie się roszczeń</h2>
                <div class="rule-content">
                    <p>Nabywca akcji, dokonując zakupu, dobrowolnie zrzeka się wszelkich roszczeń finansowych wobec organizatorów projektu wynikających z uczestnictwa w projekcie.</p>
                    
                    <p><strong>Dotyczy to w szczególności roszczeń związanych z:</strong></p>
                    <ul>
                        <li>utratą wartości akcji,</li>
                        <li>brakiem zysków,</li>
                        <li>zamknięciem projektu,</li>
                        <li>decyzjami zarządu.</li>
                    </ul>
                </div>
            </section>

            <section class="rule-section">
                <h2>§15. Zrzeczenie się drogi sądowej</h2>
                <div class="rule-content">
                    <p>Nabywca akcji zobowiązuje się do niewnoszenia pozwów ani postępowań sądowych przeciwko organizatorom projektu w związku z uczestnictwem w projekcie Bezejmeny.</p>
                    
                    <p><strong>Zrzeczenie obejmuje wszelkie spory wynikające z:</strong></p>
                    <ul>
                        <li>funkcjonowania projektu,</li>
                        <li>wartości akcji,</li>
                        <li>decyzji organizatorów,</li>
                        <li>zamknięcia projektu.</li>
                    </ul>
                    
                    <div class="warning-box">
                        <p><strong>Uwaga:</strong></p>
                        <p>Zrzeczenie to obowiązuje bezterminowo, również po:</p>
                        <ul>
                            <li>utracie akcji,</li>
                            <li>zrzeczeniu się akcji,</li>
                            <li>zakończeniu projektu.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§16. Ochrona projektu i społeczności</h2>
                <div class="rule-content">
                    <p>Organizatorzy mogą odebrać akcje osobie, która:</p>
                    <ul>
                        <li>działa na szkodę projektu,</li>
                        <li>szkodzi społeczności serwera,</li>
                        <li>podejmuje działania destabilizujące funkcjonowanie projektu.</li>
                    </ul>
                    
                    <div class="warning-box">
                        <p><strong>⚠️ WAŻNE:</strong></p>
                        <p>Decyzja taka należy wyłącznie do organizatorów projektu.</p>
                        <p>W przypadku odebrania akcji z powyższych przyczyn nie przysługuje rekompensata finansowa.</p>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§17. Zasady Mojang</h2>
                <div class="rule-content">
                    <p>Projekt Bezejmeny działa w oparciu o grę Minecraft.</p>
                    <p>Wszelkie działania projektu muszą pozostawać zgodne z zasadami Mojang / Microsoft dotyczącymi monetyzacji serwerów.</p>
                    <p>W przypadku zmian w polityce Mojang, które uniemożliwią dotychczasowy model funkcjonowania serwera, organizatorzy mogą zmienić zasady działania projektu lub go zakończyć.</p>
                </div>
            </section>

            <section class="rule-section">
                <h2>§18. Dobrowolność udziału</h2>
                <div class="rule-content">
                    <p>Nabywca akcji oświadcza, że przystępuje do projektu dobrowolnie i świadomie, znając jego charakter jako prywatnej inicjatywy niebędącej działalnością inwestycyjną ani gospodarczą.</p>
                    
                    <p><strong>Nabywca potwierdza, że:</strong></p>
                    <ul>
                        <li>zapoznał się z niniejszym regulaminem,</li>
                        <li>rozumie zasady funkcjonowania projektu,</li>
                        <li>akceptuje ryzyko finansowe związane z uczestnictwem,</li>
                        <li>jest świadomy, że projekt może nie generować zysków.</li>
                    </ul>
                </div>
            </section>

            <section class="rule-section">
                <h2>§19. Brak powstania spółki</h2>
                <div class="rule-content">
                    <p>Nabycie akcji w projekcie nie powoduje powstania spółki cywilnej, handlowej ani żadnej innej formy podmiotu prawnego pomiędzy uczestnikami projektu.</p>
                    
                    <p><strong>Posiadacze akcji:</strong></p>
                    <ul>
                        <li>nie są wspólnikami spółki,</li>
                        <li>nie tworzą zarządu ani organów decyzyjnych projektu,</li>
                        <li>nie posiadają praw właścicielskich do infrastruktury projektu.</li>
                    </ul>
                    
                    <div class="info-box">
                        <p><strong>Własność infrastruktury:</strong></p>
                        <p>Cała infrastruktura projektu, w szczególności:</p>
                        <ul>
                            <li>serwery,</li>
                            <li>domeny,</li>
                            <li>oprogramowanie,</li>
                            <li>dane,</li>
                            <li>infrastruktura techniczna</li>
                        </ul>
                        <p>pozostaje własnością organizatorów projektu.</p>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§20. Poufność informacji (NDA)</h2>
                <div class="rule-content">
                    <p>Posiadacz akcji zobowiązuje się do zachowania w poufności wszelkich informacji, które uzyskał w związku z uczestnictwem w projekcie.</p>
                    
                    <p><strong>Obowiązek poufności obejmuje w szczególności:</strong></p>
                    <ul>
                        <li>informacje finansowe projektu,</li>
                        <li>koszty i przychody projektu,</li>
                        <li>dane techniczne infrastruktury,</li>
                        <li>konfigurację serwerów,</li>
                        <li>plany rozwoju projektu,</li>
                        <li>informacje dotyczące administracji projektu,</li>
                        <li>wszelkie inne informacje uzyskane dzięki statusowi posiadacza akcji.</li>
                    </ul>
                    
                    <div class="warning-box">
                        <p><strong>🔒 Okres obowiązywania:</strong></p>
                        <p>Zakaz ujawniania informacji obowiązuje:</p>
                        <ul>
                            <li>w trakcie posiadania akcji,</li>
                            <li>po ich zrzeczeniu się,</li>
                            <li>po ich utracie,</li>
                            <li>po zakończeniu projektu.</li>
                        </ul>
                    </div>
                    
                    <div class="warning-box">
                        <p><strong>🚨 Konsekwencje naruszenia:</strong></p>
                        <p>Naruszenie zasad poufności skutkuje natychmiastową utratą wszystkich posiadanych akcji.</p>
                        <p>W przypadku naruszenia poufności:</p>
                        <ul>
                            <li>akcje przepadają bez zwrotu kosztów,</li>
                            <li>posiadacz traci prawo do przyszłych zysków,</li>
                            <li>nie przysługuje żadna rekompensata finansowa.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§21. Ostateczność decyzji organizatorów</h2>
                <div class="rule-content">
                    <p>Wszelkie decyzje dotyczące funkcjonowania projektu należą do organizatorów projektu.</p>
                    
                    <p><strong>Dotyczy to w szczególności decyzji dotyczących:</strong></p>
                    <ul>
                        <li>kierunku rozwoju serwera,</li>
                        <li>modelu finansowego projektu,</li>
                        <li>struktury kosztów,</li>
                        <li>zmian organizacyjnych,</li>
                        <li>zasad funkcjonowania projektu.</li>
                    </ul>
                    
                    <div class="highlight-box">
                        <p><strong>Decyzje organizatorów są ostateczne i nie podlegają zaskarżeniu.</strong></p>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§22. Prawo wykupu akcji przez organizatorów</h2>
                <div class="rule-content">
                    <p>Organizatorzy mają prawo odkupić akcje od posiadaczy w dowolnym momencie, jeżeli uznają to za konieczne dla dobra projektu lub jego społeczności.</p>
                    
                    <p><strong>W przypadku skorzystania z prawa wykupu:</strong></p>
                    <ul>
                        <li>posiadacz otrzymuje zwrot kosztów poniesionych przy zakupie akcji,</li>
                        <li>nie przysługuje dodatkowy zysk ani rekompensata finansowa,</li>
                        <li>decyzja organizatorów jest ostateczna i nie podlega odwołaniu.</li>
                    </ul>
                </div>
            </section>

            <section class="rule-section">
                <h2>§23. Zakaz konkurencji</h2>
                <div class="rule-content">
                    <p>Posiadacz akcji zobowiązuje się nie prowadzić działalności konkurencyjnej względem projektu Bezejmeny w trakcie posiadania akcji oraz przez okres <strong>12 miesięcy</strong> po ich zrzeczeniu się lub utracie.</p>
                    
                    <p><strong>Działalność konkurencyjna obejmuje w szczególności:</strong></p>
                    <ul>
                        <li>prowadzenie własnego serwera Minecraft o podobnym profilu,</li>
                        <li>tworzenie usług lub produktów bezpośrednio konkurencyjnych z funkcjami projektu.</li>
                    </ul>
                </div>
            </section>

            <section class="rule-section">
                <h2>§24. Zakaz szkodzenia reputacji projektu</h2>
                <div class="rule-content">
                    <p>Posiadacz akcji zobowiązuje się nie podejmować działań mogących zaszkodzić reputacji projektu, w tym w mediach społecznościowych, forach lub w kontaktach bezpośrednich.</p>
                    
                    <div class="warning-box">
                        <p><strong>Naruszenie powyższego zakazu może skutkować:</strong></p>
                        <ul>
                            <li>utratą wszystkich posiadanych akcji,</li>
                            <li>blokadą w usługach projektu,</li>
                            <li>utratą prawa do zysków i rekompensat.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="rule-section">
                <h2>§25. Postanowienia końcowe</h2>
                <div class="rule-content">
                    <p>Regulamin może zostać zmieniony przez organizatorów projektu w celu dostosowania zasad funkcjonowania projektu.</p>
                    <p>Wszelkie sytuacje nieuregulowane w regulaminie rozpatrywane są indywidualnie przez organizatorów projektu.</p>
                    
                    <div class="highlight-box">
                        <p><strong>Zakup akcji oznacza akceptację niniejszego regulaminu w całości.</strong></p>
                    </div>
                </div>
            </section>
        `;
        
        fullDocument.innerHTML = remainingSections;
        
    } catch (error) {
        fullDocument.innerHTML = `
            <div class="error-message">
                <p>⚠️ Wystąpił błąd podczas ładowania pełnego regulaminu.</p>
                <p>Proszę skorzystać z linku pobierania poniżej lub spróbować ponownie później.</p>
            </div>
        `;
    }
}

// Smooth scrolling for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});