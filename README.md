# EQST-GP Simulation Library
 
**Expanded Quantum String Theory with Gluonic Plasma**  
A Python library deriving fermion masses, mixing angles, neutrino masses,
leptogenesis, and meson phenomenology from Calabi-Yau geometry.
 
## Installation
```bash
git clone https://github.com/eqstgp/eqstgp.git
cd eqstgp && pip install -e ".[dev]"
```
 
## Quick Start
```python
import eqstgp as eg
results = eg.run_full_calculation(f_star=0.13)
```
 
## Module Map
| Module | Contents |
|--------|----------|
| core/ | Constants, CY geometry, Yukawa instantons |
| flavor/ | Seesaw, leptogenesis, quarks, CKM/PMNS |
| hadrons/ | Mesons (ChPT LO+NLO), nucleon masses |
| holographic/ | AdS/QCD hard-wall, correlators, WSR |
| diagrams/ | Loop functions, Feynman amplitudes |
| plots/ | Spectrum, parameter space, mixing maps |
 
## Testing
```bash
pytest tests/ -m "not slow" -v      # fast suite (~5 s)
pytest tests/ -v                     # full suite (~30 s)
pytest tests/ --cov=eqstgp           # with coverage
```
 
## References
- Companion paper: *EQST-GP Light Meson Phenomenology*, A. Ali (2024)
- Flavor paper:    *Flux-Textured Yukawa Couplings*, A. Ali (2024)
- NuFIT 5.2: https://www.nu-fit.org — PDG 2022: https://pdg.lbl.gov
 
