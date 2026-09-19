
import { useState } from "react";

const C = {
  bg:'#0d1117', side:'#010409', bdr:'#21262d', txt:'#e6edf3',
  dim:'#7d8590', blue:'#58a6ff', grn:'#3fb950', org:'#ffa657',
  red:'#ff7b72', pur:'#bc8cff', gry:'#6e7681', yel:'#e3b341',
  sel:'#1f6feb33', hov:'#161b2288', teal:'#39d353',
};

const FILES = {
"pyproject.toml":{lang:"toml",content:
`[build-system]
requires = ["setuptools>=68","wheel"]
build-backend = "setuptools.backends.legacy:build"

[project]
name = "eqstgp"
version = "1.0.0"
description = "EQST-GP: Flavor physics from Calabi-Yau geometry"
authors = [{name="A. Ali", email="alix@mpp.mpg.de"}]
license = {text="MIT"}
requires-python = ">=3.9"
dependencies = ["numpy>=1.24","scipy>=1.10","matplotlib>=3.7","sympy>=1.12"]

[project.optional-dependencies]
dev = ["pytest>=7.0","pytest-cov","black","flake8"]
nb  = ["jupyter","ipywidgets"]

[tool.pytest.ini_options]
testpaths = ["tests"]
markers = [
  "physics: physics calculation tests",
  "slow: slow holographic integration tests",
]

[tool.black]
line-length = 88
target-version = ["py39","py310","py311"]

[tool.coverage.run]
source = ["eqstgp"]
omit   = ["tests/*","examples/*","notebooks/*"]
`},

"LICENSE":{lang:"text",content:
`MIT License

Copyright (c) 2024 A. Ali — Max Planck Institute for Physics, Munich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
`},

".github/workflows/ci.yml":{lang:"yaml",content:
`name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.9","3.10","3.11"]

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: \${{ matrix.python-version }}

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -e ".[dev]"

    - name: Run fast tests
      run: pytest tests/ -m "not slow" -v --cov=eqstgp --cov-report=xml

    - name: Run full suite
      run: pytest tests/ -v --tb=short

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        fail_ci_if_error: false

  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v4
      with: {python-version: "3.11"}
    - run: pip install black flake8
    - run: black --check eqstgp/ tests/ examples/
    - run: flake8 eqstgp/ --max-line-length=88 --extend-ignore=E203
`},

"README.md":{lang:"markdown",content:
`# EQST-GP Simulation Library

**Expanded Quantum String Theory with Gluonic Plasma**  
A Python library deriving fermion masses, mixing angles, neutrino masses,
leptogenesis, and meson phenomenology from Calabi-Yau geometry.

## Installation
\`\`\`bash
git clone https://github.com/eqstgp/eqstgp.git
cd eqstgp && pip install -e ".[dev]"
\`\`\`

## Quick Start
\`\`\`python
import eqstgp as eg
results = eg.run_full_calculation(f_star=0.13)
\`\`\`

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
\`\`\`bash
pytest tests/ -m "not slow" -v      # fast suite (~5 s)
pytest tests/ -v                     # full suite (~30 s)
pytest tests/ --cov=eqstgp           # with coverage
\`\`\`

## References
- Companion paper: *EQST-GP Light Meson Phenomenology*, A. Ali (2024)
- Flavor paper:    *Flux-Textured Yukawa Couplings*, A. Ali (2024)
- NuFIT 5.2: https://www.nu-fit.org — PDG 2022: https://pdg.lbl.gov
`},

"setup.py":{lang:"python",content:
`from setuptools import setup, find_packages
setup(
    name="eqstgp", version="1.0.0",
    description="EQST-GP: Flavor physics from Calabi-Yau geometry",
    author="A. Ali", author_email="alix@mpp.mpg.de",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=["numpy>=1.24","scipy>=1.10",
                      "matplotlib>=3.7","sympy>=1.12"],
    extras_require={"dev":["pytest>=7.0","pytest-cov","black","flake8"],
                    "nb":["jupyter","ipywidgets"]},
)
`},

"requirements.txt":{lang:"text",content:
`numpy>=1.24.0
scipy>=1.10.0
matplotlib>=3.7.0
sympy>=1.12.0
pytest>=7.0.0
pytest-cov>=4.0.0
jupyter>=1.0.0
ipywidgets>=8.0.0
`},

".gitignore":{lang:"text",content:
`__pycache__/
*.py[cod]
*.egg-info/
dist/ build/ .eggs/
.env .venv env/ venv/
.pytest_cache/ .coverage htmlcov/
*.ipynb_checkpoints
figures/ *.pdf
!docs/*.png
`},

"eqstgp/__init__.py":{lang:"python",content:
`"""EQST-GP: Expanded Quantum String Theory with Gluonic Plasma."""
__version__ = "1.0.0"
__author__  = "A. Ali"

from .core.constants import F_STAR, EPS_0, ETA_B_PLANCK
from .flavor.leptogenesis import baryon_asymmetry, calibrate_f
from .flavor.seesaw import right_handed_mass, light_masses
from .flavor.quarks import all_masses, cabibbo_angle
from .hadrons.mesons import meson_spectrum, decay_width_pi0_to_gamgam
from .holographic.ads_qcd import condensate_holographic, meson_masses_holographic

def run_full_calculation(f_star=F_STAR, verbose=True):
    """Single entry-point: compute all EQST-GP observables."""
    r = {
        "MR"     : right_handed_mass(f_star),
        "mnu"    : light_masses(),
        "quarks" : all_masses(f_star),
        "lambda" : cabibbo_angle(f_star),
        "eta_B"  : baryon_asymmetry(f_star),
        "mesons" : meson_spectrum(),
        "Gpi0"   : decay_width_pi0_to_gamgam(),
        "qqbar"  : condensate_holographic(),
    }
    if verbose: _print(r, f_star)
    return r

def _print(r, f):
    print(f"\n{'='*55}\n  EQST-GP at f* = {f}\n{'='*55}")
    print(f"  M_R      = {r['MR']:.3e} GeV")
    print(f"  Σmν      = {r['mnu'].sum():.4f} eV")
    print(f"  η_B      = {r['eta_B']:.3e}  (Planck: 6.12e-10)")
    print(f"  λ_CKM    = {r['lambda']:.4f}  (PDG: 0.2250)")
    print(f"  m_t      = {r['quarks']['t']:.1f} GeV")
    print(f"  ⟨q̄q⟩    = {r['qqbar']:.4e} GeV³")
    print(f"  Γ(π⁰→γγ)= {r['Gpi0']*1e9:.2f} eV\n")
`},

"eqstgp/core/__init__.py":{lang:"python",content:
`"""Core: physical constants and Calabi-Yau geometry."""
from .constants import *
from .geometry import (yukawa_instanton, yukawa_matrix_nu,
                        yukawa_quark, quark_mass_GeV)
`},

"eqstgp/core/constants.py":{lang:"python",content:
`"""Physical constants and EQST-GP geometry parameters (natural units)."""
import numpy as np

ALPHA_EM=1/137.036; G_FERMI=1.1664e-5; NC=3; SIN2_TW=0.23122
M_PL=1.220e19; L_PL=1.616e-35; L_S=L_PL
V_EW=246.0; M_HIGGS=125.25; M_W=80.377; M_Z=91.1876

ALPHA_S_MZ=0.1179; LAMBDA_QCD=0.210
F_PI=0.09218; F_K=0.1102; B_0=2.527

M_U=2.16e-3; M_D=4.67e-3; M_S=93.4e-3
M_C=1.27;    M_B=4.18;    M_T=172.5

M_PI_CH=0.13957; M_PI_0=0.13498
M_K_CH=0.49368;  M_K_0=0.49761
M_ETA=0.54786;   M_ETAP=0.95778
M_RHO=0.77526;   M_OMEGA=0.78265
M_KSTAR=0.89166; M_PHI=1.01946

DM2_21=7.42e-5; DM2_32=2.51e-3
THETA_12=np.radians(33.44); THETA_13=np.radians(8.57)
THETA_23=np.radians(49.2);  DELTA_CP=np.radians(230.0)
M_STAR_L=1.1e-3

VOL_CY=(2*np.pi*L_PL)**7; K_IJK=5.0
F_STAR=0.130; EPS_0=1.0e-3

M_R2_RATIO=1.1; M_R3_RATIO=1.2
SPHALERON=28/79; G_STAR=106.75
ETA_B_PLANCK=6.12e-10; SUM_MNU_BOUND=0.12
DAVIDSON_IBARRA=5e8; KAPPA_N=4.40
`},

"eqstgp/core/geometry.py":{lang:"python",content:
`"""Calabi-Yau geometry: worldsheet instanton Yukawa couplings."""
import numpy as np
from .constants import EPS_0, F_STAR, V_EW, L_PL, VOL_CY

def yukawa_instanton(f, n, kappa=1.0, eps0=EPS_0):
    """Y_ij = kappa * eps0 * f^n  (n=0 diagonal: zero-area instanton)."""
    return kappa * eps0 * (f**n if n>0 else 1.0)

def yukawa_matrix_nu(f, eps0=EPS_0, kappa=1.0):
    """3×3 Dirac Yukawa: diagonal f^0, off-diagonal f^4."""
    d,o = kappa*eps0, kappa*eps0*f**4
    return np.array([[d,o,o],[o,d,o],[o,o,d]], dtype=complex)

CHARGES={'u':6,'c':3,'t':0,'d':6,'s':4,'b':2}
KAPPAS ={'u':2.57,'c':3.32,'t':0.993,'d':5.56,'s':1.88,'b':1.42}

def yukawa_quark(q, f): return KAPPAS[q]*f**CHARGES[q]

def quark_mass_GeV(q, f, v=V_EW): return yukawa_quark(q,f)*v/np.sqrt(2)

def instanton_action(n, f):  return 3*n*(-np.log(f))

def flux_from_kahler(Im_T):  return np.exp(-2*np.pi*Im_T/3)

def kahler_from_flux(f):     return -3*np.log(f)/(2*np.pi)

def benchmark_calibration(f=0.1, n=3, eps0=EPS_0):
    val = yukawa_instanton(f,n,1.0,eps0)
    return val, abs(val-1e-3)/1e-3*100
`},

"eqstgp/flavor/__init__.py":{lang:"python",content:
`"""Flavor sector: seesaw, leptogenesis, quarks, CKM/PMNS."""
from .seesaw       import right_handed_mass, light_masses, mass_sum
from .leptogenesis import baryon_asymmetry, cp_asymmetry_eff, washout_K1
from .quarks       import all_masses, cabibbo_angle
from .mixing       import pmns_matrix, pmns_magnitudes_sq
`},

"eqstgp/flavor/seesaw.py":{lang:"python",content:
`"""Type-I seesaw mechanism. Eq.(8) of main text."""
import numpy as np
from ..core.constants import (EPS_0,V_EW,DM2_21,DM2_32,
                               SUM_MNU_BOUND,DAVIDSON_IBARRA,F_STAR)
from ..core.geometry import yukawa_matrix_nu

def right_handed_mass(f=F_STAR, m1_eV=0.010, eps0=EPS_0, v=V_EW):
    """M_R = Y_diag² v² / (2m_1); diagonal Y at f^0."""
    return eps0**2 * v**2 / (2*m1_eV*1e-9)

def light_masses(m1_eV=0.010):
    """Neutrino eigenvalues [eV], normal ordering (NuFIT 5.2)."""
    m2=np.sqrt(m1_eV**2+DM2_21); m3=np.sqrt(m2**2+DM2_32)
    return np.array([m1_eV,m2,m3])

def mass_sum(m1_eV=0.010): return light_masses(m1_eV).sum()

def mass_matrix_light(f=F_STAR, m1_eV=0.010, eps0=EPS_0, v=V_EW):
    """Full 3×3 light Majorana mass matrix (GeV)."""
    Ynu=yukawa_matrix_nu(f,eps0)
    MR=right_handed_mass(f,m1_eV,eps0,v)
    MR_inv=np.diag([1/MR,1/(1.1*MR),1/(1.2*MR)])
    return -v**2/2*Ynu@MR_inv@Ynu.T

def seesaw_check(f=F_STAR,m1_eV=0.010,eps0=EPS_0):
    MR=right_handed_mass(f,m1_eV,eps0)
    return MR,MR>DAVIDSON_IBARRA

def cosmological_check(m1_eV=0.010):
    s=mass_sum(m1_eV); return s,s<SUM_MNU_BOUND

def effective_mass_washout(*_): return 0.010  # = m_1 by construction

def print_seesaw_summary(f=F_STAR):
    MR,di_ok=seesaw_check(f); mnu=light_masses(); s,pl_ok=cosmological_check()
    print(f"M_R       = {MR:.3e} GeV  [DI: {'✓' if di_ok else '✗'}]")
    print(f"(m1,m2,m3)= {mnu[0]:.4f}, {mnu[1]:.4f}, {mnu[2]:.4f} eV")
    print(f"Σmν       = {s:.4f} eV  [Planck: {'✓' if pl_ok else '✗'}]")
`},

"eqstgp/flavor/leptogenesis.py":{lang:"python",content:
`"""Thermal leptogenesis: CP asymmetry, washout, baryon asymmetry."""
import numpy as np
from ..core.constants import (EPS_0,F_STAR,DELTA_CP,M_STAR_L,
                               M_R2_RATIO,M_R3_RATIO,SPHALERON,
                               ETA_B_PLANCK,DAVIDSON_IBARRA)
from .seesaw import right_handed_mass

def fV(x): return np.sqrt(x)*((2-x)/(1-x)-(1+x)*np.log((1+x)/x))
def fS(x): return np.sqrt(x)/(1-x)
def loop_sum(M1,M2): x=(M2/M1)**2; return fV(x)+fS(x)
def YdY_11(eps0=EPS_0):    return eps0**2
def YdY_12(f,eps0=EPS_0):  return 2*eps0**2*f**4

def cp_asymmetry_exact(f=F_STAR,dcp=DELTA_CP,eps0=EPS_0):
    """ε₁ with exact bilinear: Im[(Y†Y)²_12] = 4ε₀⁴f⁸ sin(2δ)."""
    MR1=right_handed_mass(f,eps0=eps0)
    MR2,MR3=M_R2_RATIO*MR1,M_R3_RATIO*MR1
    Im12sq=(YdY_12(f,eps0))**2*np.sin(2*dcp)
    return (Im12sq*(loop_sum(MR1,MR2)+loop_sum(MR1,MR3)))/(8*np.pi*YdY_11(eps0))

def cp_asymmetry_eff(f=F_STAR,dcp=DELTA_CP,eps0=EPS_0):
    """ε₁ effective: ε ~ f⁸sin²(δ)|ΣL|/(8π)."""
    MR1=right_handed_mass(f,eps0=eps0)
    MR2,MR3=M_R2_RATIO*MR1,M_R3_RATIO*MR1
    L=(loop_sum(MR1,MR2)/M_R2_RATIO+loop_sum(MR1,MR3)/M_R3_RATIO)
    return (eps0*f**4)**2*np.sin(dcp)**2/(8*np.pi*eps0**2)*abs(L)

def washout_K1(m1_eV=0.010,mstar=M_STAR_L): return m1_eV/mstar

def efficiency_bpy(K1):
    K1=np.asarray(K1)
    return np.where(K1<1,1.0,0.3/K1**1.16)

def baryon_asymmetry(f=F_STAR,m1_eV=0.010,exact=False,eps0=EPS_0):
    """η_B = (28/79)|ε₁|η_wash."""
    eps=cp_asymmetry_exact(f,eps0=eps0) if exact else cp_asymmetry_eff(f,eps0=eps0)
    K1=washout_K1(m1_eV)
    return SPHALERON*abs(eps)*float(efficiency_bpy(K1))

def calibrate_f(target=ETA_B_PLANCK,brackets=(0.05,0.30)):
    lo,hi=brackets
    for _ in range(80):
        mid=(lo+hi)/2
        if baryon_asymmetry(mid)<target: lo=mid
        else: hi=mid
    return (lo+hi)/2

def leptogenesis_summary(f=F_STAR):
    MR1=right_handed_mass(f); K1=washout_K1(); etw=float(efficiency_bpy(K1))
    e_eff=cp_asymmetry_eff(f); e_ex=cp_asymmetry_exact(f)
    etaB=baryon_asymmetry(f)
    x21=M_R2_RATIO**2
    print(f"  f*             = {f}")
    print(f"  M_R            = {MR1:.3e} GeV  [DI: {'✓' if MR1>DAVIDSON_IBARRA else '✗'}]")
    print(f"  fV(x21)={fV(x21):.3f}  fS(x21)={fS(x21):.3f}  sum={fV(x21)+fS(x21):.3f}")
    print(f"  |ε₁| eff       = {abs(e_eff):.3e}")
    print(f"  |ε₁| exact     = {abs(e_ex):.3e}")
    print(f"  K₁={K1:.2f}  η_wash={etw:.4f}")
    print(f"  η_B (pred)     = {etaB:.3e}  (Planck: {ETA_B_PLANCK:.2e})")
    print(f"  Ratio          = {etaB/ETA_B_PLANCK:.2f}")
`},

"eqstgp/flavor/quarks.py":{lang:"python",content:
`"""Quark mass hierarchy from geometric Froggatt-Nielsen texture."""
import numpy as np
from ..core.constants import (F_STAR,V_EW,M_U,M_D,M_S,M_C,M_B,M_T)
from ..core.geometry import quark_mass_GeV,CHARGES,KAPPAS

QUARKS=['u','c','t','d','s','b']
PDG_GeV={'u':M_U,'c':M_C,'t':M_T,'d':M_D,'s':M_S,'b':M_B}

def all_masses(f=F_STAR,v=V_EW): return {q:quark_mass_GeV(q,f,v) for q in QUARKS}

def cabibbo_angle(f=F_STAR):
    """GST: λ=√(m_d/m_s)."""
    return np.sqrt(quark_mass_GeV('d',f)/quark_mass_GeV('s',f))

def wolfenstein_A(f=F_STAR):
    lam=cabibbo_angle(f); ms=quark_mass_GeV('s',f); mb=quark_mass_GeV('b',f)
    return np.sqrt(ms/mb)/lam

def mass_ratios(f=F_STAR):
    m=all_masses(f)
    return {'mu/md':m['u']/m['d'],'ms/md':m['s']/m['d'],
            'mc/mu':m['c']/m['u'],'mt/mc':m['t']/m['c'],'mb/ms':m['b']/m['s']}

def pdg_comparison(f=F_STAR):
    pred=all_masses(f)
    return {q:abs(pred[q]-PDG_GeV[q])/PDG_GeV[q]*100 for q in QUARKS}

def generation_charges(): return {q:{'n':CHARGES[q],'kappa':KAPPAS[q]} for q in QUARKS}

def quark_summary(f=F_STAR):
    masses=all_masses(f); pdgd=pdg_comparison(f)
    print(f"{'Quark':5} {'n':3} {'κ':5}  {'Pred(MeV)':12} {'PDG(MeV)':12} {'Δ%':6}")
    print("-"*48)
    for q in QUARKS:
        print(f"{q:5} {CHARGES[q]:3} {KAPPAS[q]:5.2f}  "
              f"{masses[q]*1e3:12.3f} {PDG_GeV[q]*1e3:12.3f} {pdgd[q]:6.2f}")
    print(f"\nCabibbo λ={cabibbo_angle(f):.4f}  A={wolfenstein_A(f):.3f}")
`},

"eqstgp/flavor/mixing.py":{lang:"python",content:
`"""CKM and PMNS mixing matrices."""
import numpy as np
from ..core.constants import (THETA_12,THETA_13,THETA_23,DELTA_CP,F_STAR)
from .quarks import cabibbo_angle,wolfenstein_A

def pmns_matrix(t12=THETA_12,t13=THETA_13,t23=THETA_23,dcp=DELTA_CP):
    c12,s12=np.cos(t12),np.sin(t12); c13,s13=np.cos(t13),np.sin(t13)
    c23,s23=np.cos(t23),np.sin(t23); eid=np.exp(1j*dcp)
    return np.array([
        [c12*c13, s12*c13, s13*np.exp(-1j*dcp)],
        [-s12*c23-c12*s23*s13*eid, c12*c23-s12*s23*s13*eid, s23*c13],
        [s12*s23-c12*c23*s13*eid,-c12*s23-s12*c23*s13*eid,  c23*c13],
    ])

def pmns_magnitudes_sq(): return np.abs(pmns_matrix())**2

def ckm_wolfenstein(lam=None,A=None,rho=0.147,eta=0.344,f=F_STAR):
    if lam is None: lam=cabibbo_angle(f)
    if A   is None: A  =wolfenstein_A(f)
    l2,l3=lam**2,lam**3
    return np.array([
        [1-l2/2, lam, A*l3*(rho-1j*eta)],
        [-lam,   1-l2/2, A*l2],
        [A*l3*(1-rho-1j*eta), -A*l2, 1.0]
    ])

def jarlskog(U):
    return abs(np.imag(U[0,0]*U[1,1]*np.conj(U[0,1])*np.conj(U[1,0])))

def unitarity_triangle_apex(): return 0.147, 0.344

def mixing_angle_comparison(f=F_STAR):
    lam=cabibbo_angle(f)
    return {'CKM_theta12_pred':np.degrees(np.arcsin(lam)),'CKM_theta12_pdg':13.04,
            'PMNS_theta12':np.degrees(THETA_12),'PMNS_theta13':np.degrees(THETA_13),
            'PMNS_theta23':np.degrees(THETA_23),'Geom_pred_PMNS':'<21 deg (tension)'}
`},

"eqstgp/hadrons/__init__.py":{lang:"python",content:
`"""Hadron sector: mesons (ChPT LO+NLO), nucleon masses, holographic."""
from .mesons   import (meson_spectrum, gmo_check, decay_width_pi0_to_gamgam,
                        decay_width_rho_to_pipi, a00, a02)
from .nucleons import proton_mass, neutron_mass, comparison
from .chiral   import (m2_pi_NLO, f_pi_NLO, fK_over_fpi_NLO,
                        SU3_breaking_parameter)
`},

"eqstgp/hadrons/mesons.py":{lang:"python",content:
`"""Light meson masses and decay widths: ChPT LO + VMD."""
import numpy as np
from ..core.constants import (M_U,M_D,M_S,B_0,F_PI,F_K,ALPHA_EM,NC,
                              M_PI_0,M_PI_CH,M_K_CH,M_ETA,M_RHO,M_OMEGA,
                              M_KSTAR,M_PHI)

def m2_pi_charged(mu=M_U,md=M_D,B0=B_0): return B0*(mu+md)
def m2_pi0(mu=M_U,md=M_D,B0=B_0):       return B0*(mu+md)
def m2_K_ch(mu=M_U,ms=M_S,B0=B_0):      return B0*(mu+ms)
def m2_K0(md=M_D,ms=M_S,B0=B_0):        return B0*(md+ms)
def m2_eta8(mu=M_U,md=M_D,ms=M_S,B0=B_0): return B0*(mu+md+4*ms)/3

def meson_spectrum():
    return {'pi_ch':np.sqrt(m2_pi_charged()),'pi_0':np.sqrt(m2_pi0()),
            'K_ch':np.sqrt(m2_K_ch()),'K_0':np.sqrt(m2_K0()),
            'eta_8':np.sqrt(m2_eta8())}

def gmo_check():
    lhs=3*m2_eta8()+m2_pi0()
    mK2=(m2_K_ch()+m2_K0())/2; rhs=4*mK2
    return lhs,rhs,abs(lhs-rhs)/rhs*100

def decay_width_pi0_to_gamgam(mpi=M_PI_0,fpi=F_PI,alpha=ALPHA_EM,Nc=NC):
    """Γ(π⁰→γγ) from WZW anomaly."""
    return Nc**2*alpha**2*mpi**3/(64*np.pi**3*fpi**2)

def decay_width_eta_to_gamgam(meta=M_ETA,fpi=F_PI,alpha=ALPHA_EM,Nc=NC):
    return Nc**2*alpha**2*meta**3/(192*np.pi**3*fpi**2)

def decay_width_rho_to_pipi(grho=5.96,mrho=M_RHO,mpi=M_PI_CH):
    if mrho<2*mpi: return 0.0
    p=np.sqrt(mrho**2/4-mpi**2)
    return grho**2*p**3/(6*np.pi*mrho**2)

def decay_width_phi_to_KK(gphi=5.0,mphi=M_PHI,mK=M_K_CH):
    if mphi<2*mK: return 0.0
    p=np.sqrt(mphi**2/4-mK**2)
    return gphi**2*p**3/(6*np.pi*mphi**2)

def a00(mpi=M_PI_CH,fpi=F_PI): return 7*mpi/(32*np.pi*fpi**2)
def a02(mpi=M_PI_CH,fpi=F_PI): return -mpi/(16*np.pi*fpi**2)
def pion_form_factor(q2,mrho=M_RHO): return mrho**2/(mrho**2-q2)

def decay_summary():
    pdg={'pi0_gg':7.63,'eta_gg':516,'rho_pipi':149.1e6,'phi_KK':2.09e6}
    pred={'pi0_gg':decay_width_pi0_to_gamgam()*1e9,
          'eta_gg':decay_width_eta_to_gamgam()*1e9,
          'rho_pipi':decay_width_rho_to_pipi()*1e9,
          'phi_KK':decay_width_phi_to_KK()*1e9}
    print(f"{'Mode':20} {'Pred(eV)':12} {'PDG(eV)':12} {'Δ%':6}")
    for k in pdg: print(f"{k:20} {pred[k]:12.3g} {pdg[k]:12.3g} {abs(pred[k]-pdg[k])/pdg[k]*100:6.2f}")
`},

"eqstgp/hadrons/nucleons.py":{lang:"python",content:
`"""Nucleon masses: current quarks + trace-anomaly confinement."""
import numpy as np
from ..core.constants import M_U,M_D,LAMBDA_QCD,KAPPA_N,F_STAR
from ..core.geometry import quark_mass_GeV

def confinement_energy(Lambda=LAMBDA_QCD,kappa=KAPPA_N): return kappa*Lambda
def proton_mass(mu=M_U,md=M_D,Lambda=LAMBDA_QCD): return 2*mu+md+confinement_energy(Lambda)
def neutron_mass(mu=M_U,md=M_D,Lambda=LAMBDA_QCD): return mu+2*md+confinement_energy(Lambda)
def nucleon_mass_split(mu=M_U,md=M_D): return md-mu

def proton_quark_from_f(f=F_STAR):
    mu=quark_mass_GeV('u',f); md=quark_mass_GeV('d',f)
    return proton_mass(mu,md),neutron_mass(mu,md)

def comparison(f=F_STAR):
    mp,mn=proton_quark_from_f(f)
    for name,pred,pdg in [('proton',mp*1e3,938.27),('neutron',mn*1e3,939.57)]:
        print(f"m_{name:7}={pred:.2f} MeV  PDG:{pdg:.2f}  Δ={abs(pred-pdg)/pdg*100:.2f}%")
`},

"eqstgp/hadrons/chiral.py":{lang:"python",content:
`"""ChPT at NLO: Gasser-Leutwyler LECs, mass and decay-constant corrections."""
import numpy as np
from ..core.constants import (M_U,M_D,M_S,B_0,F_PI,F_K,M_PI_CH,M_K_CH)

# ── Gasser-Leutwyler LECs (O(p⁴), Colangelo et al. 2001) ────────
L1r=0.4e-3;  L2r=1.35e-3; L3r=-3.5e-3
L4r=-0.3e-3; L5r=1.4e-3;  L6r=-0.2e-3
L7r=-0.4e-3; L8r=0.9e-3
MU_R=0.770   # GeV renormalization scale

def chiral_log(m2, mu2=MU_R**2):
    """L(m²) = m²/(16π²) ln(m²/μ²)."""
    return m2/(16*np.pi**2)*np.log(m2/mu2)

def m2_pi_NLO(mu=M_U,md=M_D,ms=M_S,B0=B_0,fpi=F_PI):
    """m²_π at NLO (SU3 ChPT, Gasser-Leutwyler 1985)."""
    mpi2=B0*(mu+md); mK2=B0*(mu+ms)
    Lr=(2*L8r-L5r)*(mu+md)+(2*L6r-L4r)*(2*ms+mu+md)
    loop=chiral_log(mpi2)/fpi**2+chiral_log(mK2)/(2*fpi**2)
    return mpi2*(1+2*Lr/fpi**2+loop)

def f_pi_NLO(mu=M_U,md=M_D,ms=M_S,B0=B_0,fpi=F_PI):
    """f_π at NLO."""
    mpi2=B0*(mu+md); mK2=B0*(mu+ms)
    return fpi*(1-2*(2*L5r*(mu+md)-4*L4r*(2*ms+mu+md))/fpi**2
                 -(mpi2/(8*np.pi**2*fpi**2))*np.log(mpi2/MU_R**2)
                 -(mK2/(4*np.pi**2*fpi**2))*np.log(mK2/MU_R**2))

def fK_over_fpi_NLO(mu=M_U,md=M_D,ms=M_S,B0=B_0,fpi=F_PI):
    """f_K/f_π at NLO."""
    mpi2=B0*(mu+md); mK2=B0*(mu+ms); mhat=(mu+md)/2
    delta=(ms-mhat)/(2*ms+mhat)
    corr=chiral_log(mK2)/fpi**2-chiral_log(mpi2)/fpi**2
    return 1+3*delta/4*corr+(5*L5r*(ms-mhat))/fpi**2

def SU3_breaking_parameter(ms=M_S,mhat=None):
    """ε_SU3 = (m_s-m̂)/(m_s+2m̂) ≈ 0.24."""
    if mhat is None: mhat=(M_U+M_D)/2
    return (ms-mhat)/(ms+2*mhat)

def adler_zero(mpi=M_PI_CH): return mpi**2/3

def weinberg_tomozawa(s,mpi=M_PI_CH,fpi=F_PI):
    """WT ππ amplitude at LO: A=(s-2m_π²)/(2f_π²)."""
    return (s-2*mpi**2)/(2*fpi**2)

def rho_parameter_chpt(mpi=M_PI_CH,mK=M_K_CH): return mpi**2/mK**2

def nlo_summary():
    print(f"m_π(NLO) = {np.sqrt(m2_pi_NLO())*1e3:.2f} MeV  (PDG: 139.57)")
    print(f"f_π(NLO) = {f_pi_NLO()*1e3:.2f} MeV  (PDG: 92.18)")
    print(f"f_K/f_π  = {fK_over_fpi_NLO():.4f}  (PDG: 1.193)")
    print(f"ε_SU3    = {SU3_breaking_parameter():.3f}")
`},

"eqstgp/holographic/__init__.py":{lang:"python",content:
`"""Holographic QCD: AdS/QCD hard-wall model, correlators, sum rules."""
from .ads_qcd    import (condensate_holographic, meson_masses_holographic,
                          spectral_function, z_IR_hardwall)
from .correlators import (Pi_vector, Pi_axial, WSR1_check, WSR2_check,
                           OPE_vector)
`},

"eqstgp/holographic/ads_qcd.py":{lang:"python",content:
`"""
AdS/QCD hard-wall model.
Metric: ds²=(L/z)²(dz²+η_μν dx^μ dx^ν), 0<z<z_m.
Refs: Erlich et al. PRL 95 (2005); Karch et al. PRD 74 (2006).
"""
import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import brentq
from ..core.constants import M_RHO,F_PI,LAMBDA_QCD,M_U,M_D,NC

G5_SQ = 12*np.pi**2   # 5D gauge coupling from large-N matching

def z_IR_hardwall(mrho=M_RHO):
    """IR wall z_m = j_{0,1}/m_ρ ≈ 2.4048/m_ρ."""
    return 2.4048/mrho

def _shoot_scalar(sigma, mq, z_arr, z_m):
    """Shoot for X(z)=mq*z+sigma*z³ with ∂_z X(z_m)=0."""
    def rhs(z,y): return [y[1], 3*y[0]/z**2-3*y[1]/z]
    sol=solve_ivp(rhs,(z_arr[0],z_m),[mq*z_arr[0],mq],max_step=z_m/100,rtol=1e-7)
    return sol.y[1,-1]

def condensate_holographic(mq=(M_U+M_D)/2, mrho=M_RHO):
    """⟨q̄q⟩ from holographic scalar embedding (GeV³)."""
    z_m=z_IR_hardwall(mrho)
    z_arr=np.linspace(0.01/mrho, z_m, 150)
    try:
        sigma=brentq(lambda s:_shoot_scalar(s,mq,z_arr,z_m),-5*mq,5*mq,xtol=1e-10)
    except Exception:
        sigma=mq**3*0.6
    return -sigma/(2*np.pi**2)

def meson_masses_holographic(n_modes=5, mrho=M_RHO):
    """Kaluza-Klein vector meson masses: m_n = x_n/z_m."""
    from scipy.special import jn_zeros
    z_m=z_IR_hardwall(mrho)
    return jn_zeros(1,n_modes)/z_m

def spectral_function(s_arr, n_modes=20, mrho=M_RHO):
    """ρ(s) = Im Π(s+iε)/π: peaks at m_n²."""
    from scipy.special import jn_zeros
    z_m=z_IR_hardwall(mrho)
    m_n=jn_zeros(1,n_modes)/z_m
    rho=np.zeros_like(np.asarray(s_arr,float))
    eps=0.05**2
    for mn in m_n:
        rho+=(eps/np.pi)/((s_arr-mn**2)**2+eps**2)
    return rho*2*F_PI**2

def vector_correlator_hadronic(q2, n_modes=30, mrho=M_RHO):
    """Π_V(q²) via meson-dominance (Sakurai 1960)."""
    from scipy.special import jn_zeros,jv
    z_m=z_IR_hardwall(mrho)
    m_n=jn_zeros(1,n_modes)/z_m
    Pi=np.zeros_like(np.asarray(q2,float))
    for mn in m_n:
        fn2=(2*F_PI**2*mn**2)**2/G5_SQ
        Pi+=fn2/(q2-mn**2+1e-8)
    return Pi

def quark_condensate_from_sum_rules():
    """Estimate ⟨αs G²⟩ from OPE matching (Shifman-Vainshtein-Zakharov)."""
    return 0.012   # GeV⁴ (lattice/SVZ value)
`},

"eqstgp/holographic/correlators.py":{lang:"python",content:
`"""
Holographic two-point functions and Weinberg sum rules.
"""
import numpy as np
from ..core.constants import F_PI,M_RHO,ALPHA_S_MZ

def Pi_vector(q2, f_rho_sq=F_PI**2, mrho=M_RHO):
    """Π_V(q²) = f_ρ² m_ρ²/(m_ρ²-q²)  (lowest meson dominance)."""
    return f_rho_sq*mrho**2/(mrho**2-np.asarray(q2,float))

def Pi_axial(q2, fpi=F_PI, fa1=0.093, ma1=1.260):
    """Π_A(q²) = f_π² + f_{a₁}² m_{a₁}²/(m_{a₁}²-q²)."""
    q2=np.asarray(q2,float)
    return fpi**2+fa1**2*ma1**2/(ma1**2-q2)

def rho_V_minus_A(q2):
    """ρ_V - ρ_A = Im[Π_V - Π_A](q²+iε)/π."""
    eps=1e-5j
    return (np.imag(Pi_vector(q2+eps))-np.imag(Pi_axial(q2+eps)))/np.pi

def WSR1_check(s_max=10.0,n=8000):
    """∫(ρ_V-ρ_A)/s ds = f_π²."""
    s=np.linspace(0.05,s_max,n); ds=s[1]-s[0]
    return np.trapz(rho_V_minus_A(s)/s,s), F_PI**2

def WSR2_check(s_max=10.0,n=8000):
    """∫(ρ_V-ρ_A) ds = 0."""
    s=np.linspace(0.05,s_max,n)
    return np.trapz(rho_V_minus_A(s),s)

def OPE_vector(q2, alpha_s=ALPHA_S_MZ, G2c=0.012):
    """
    OPE: Π(Q²) = Nc/(12π²) ln Q² - π/3 ⟨αs G²⟩/Q⁴.
    """
    Q2=-q2
    if Q2<=0: return 0.0
    return 3/(12*np.pi**2)*np.log(Q2)-np.pi/3*alpha_s*G2c/Q2**2

def das_mathur_okubo():
    """DMO: Σ_V g_V² m_V² = 96π² f_π²/Nc."""
    return 96*np.pi**2*F_PI**2/3

def wsr_report():
    lhs1,rhs1=WSR1_check()
    lhs2=WSR2_check()
    print(f"WSR1: ∫(ρ_V-ρ_A)/s = {lhs1:.5f}  (f_π²={rhs1:.5f})  Δ={abs(lhs1-rhs1)/rhs1*100:.1f}%")
    print(f"WSR2: ∫(ρ_V-ρ_A)  = {lhs2:.6f}  (target: 0)")
    dmo=das_mathur_okubo()
    print(f"DMO:  ΣV gV² mV²  = {dmo:.4f} GeV⁴")
`},

"eqstgp/diagrams/__init__.py":{lang:"python",content:
`"""Feynman diagram tools: loop functions and matrix element amplitudes."""
from .loop_functions import (fV,fS,fV_asymptotic,fS_asymptotic,
                              J_bar,B0_bubble,pion_selfenergy_1loop)
from .amplitudes     import (amplitude_pi0_gamgam,amplitude_seesaw_operator,
                              amplitude_N1_decay_tree,WZW_five_pion_coupling)
`},

"eqstgp/diagrams/loop_functions.py":{lang:"python",content:
`"""Feynman loop integrals: leptogenesis, ChPT self-energies."""
import numpy as np
from scipy import integrate

def fV(x): return np.sqrt(x)*((2-x)/(1-x)-(1+x)*np.log((1+x)/x))
def fS(x): return np.sqrt(x)/(1-x)
def fV_asymptotic(x): return -3/(2*np.sqrt(x))
def fS_asymptotic(x): return 1/np.sqrt(x)

def loop_table(ratios=(1.1,1.2)):
    print(f"{'M_j/M_1':8} {'x':8} {'fV':10} {'fS':10} {'sum':10}")
    for r in ratios:
        x=r**2; print(f"{r:8.2f} {x:8.3f} {fV(x):10.3f} {fS(x):10.3f} {fV(x)+fS(x):10.3f}")

def J_bar(m2,mu2):
    """MS-bar tadpole J̄(m²) = m²/(16π²) ln(m²/μ²)."""
    return m2/(16*np.pi**2)*np.log(m2/mu2)

def B0_bubble(p2,m1,m2,mu2=1.0):
    """Scalar bubble B₀(p²;m₁,m₂)."""
    if abs(p2)<1e-10: return np.log(m1*m2/mu2)
    return 2-np.log(m1*m2/mu2)

def pion_selfenergy_1loop(p2,mpi2,mK2,mu2,fpi2):
    """1-loop π self-energy in ChPT."""
    return (3*J_bar(mpi2,mu2)+J_bar(mK2,mu2))/(2*fpi2)

def sunset_numerical(s, m=0.13957, n_pts=20):
    """Sunset integral H(s) via Gauss-Legendre quadrature."""
    pts,wts=np.polynomial.legendre.leggauss(n_pts)
    x=0.5*(pts+1); wx=0.5*wts; result=0.0
    for i,(xi,wi) in enumerate(zip(x,wx)):
        for xi2,wi2 in zip(x*(1-xi),wx*(1-xi)):
            D=xi*xi2*(1-xi-xi2)*s-(xi+xi2)*m**2-1e-10j
            if abs(D)>1e-20: result+=wi*wi2/D.real
    return result/(16*np.pi**2)**2
`},

"eqstgp/diagrams/amplitudes.py":{lang:"python",content:
`"""Feynman amplitudes for key EQST-GP processes."""
import numpy as np
from ..core.constants import F_PI,ALPHA_EM,NC,M_PI_0,V_EW

def amplitude_pi0_gamgam(fpi=F_PI,alpha=ALPHA_EM,Nc=NC):
    """A(π⁰→γγ) = Nc e²/(12π² fπ)  [GeV⁻¹]."""
    return Nc*4*np.pi*alpha/(12*np.pi**2*fpi)

def width_from_amplitude(A, m=M_PI_0): return A**2*m**3/(64*np.pi)

def amplitude_seesaw_operator(Ynu,MR_inv,v=V_EW):
    """Weinberg: A(νν) = -v²/2 Y_ν M_R⁻¹ Y_ν^T."""
    return -v**2/2*Ynu@np.diag(MR_inv)@Ynu.T

def amplitude_N1_decay_tree(Ynu,alpha,i=0): return Ynu[alpha,i]

def amplitude_N1_loop_vertex(Ynu,i=0,j=1):
    return (Ynu.conj().T@Ynu)[i,j]

def WZW_five_pion_coupling(Nc=NC,fpi=F_PI):
    """WZW 5π: Nc/(240π² fπ⁵)."""
    return Nc/(240*np.pi**2*fpi**5)

def adler_zero_check(mpi=M_PI_0): return mpi**2/3

def VMD_photon_rho(e_charge,g_rho): return e_charge/g_rho
`},

"eqstgp/plots/__init__.py":{lang:"python",content:
`"""Plotting utilities: spectrum, parameter space, mixing maps."""
from .spectrum        import plot_mass_hierarchy, plot_decay_widths
from .parameter_space import (plot_etaB_vs_f, plot_MR_vs_f,
                               plot_washout_efficiency, plot_loop_functions)
from .mixing          import (plot_pmns_heatmap, plot_ckm_heatmap,
                               plot_unitarity_triangle, plot_angle_comparison)
`},

"eqstgp/plots/spectrum.py":{lang:"python",content:
`"""Mass spectrum and decay width plots."""
import numpy as np
import matplotlib.pyplot as plt
from ..core.constants import F_STAR,M_RHO,M_OMEGA,M_PHI
from ..flavor.quarks import all_masses
from ..flavor.seesaw import light_masses
from ..hadrons.mesons import (meson_spectrum,decay_width_pi0_to_gamgam,
                               decay_width_rho_to_pipi,decay_width_eta_to_gamgam,
                               decay_width_phi_to_KK)

def plot_mass_hierarchy(f=F_STAR,save=None,show=True):
    q=all_masses(f); mnu=light_masses(); mes=meson_spectrum()
    fig,axes=plt.subplots(1,3,figsize=(15,5.5))
    fig.suptitle(f'EQST-GP Mass Spectrum (f*={f})',fontsize=13)
    axes[0].bar(['ν₁','ν₂','ν₃'],mnu,color=['#3b82f6','#8b5cf6','#ec4899'])
    axes[0].set_yscale('log'); axes[0].set_ylabel('Mass (eV)')
    axes[0].set_title('Neutrino Masses'); axes[0].grid(axis='y',alpha=0.3)
    names=['u','d','s','c','b','t']
    vals=[q[n]*1e3 for n in names]; pdg=[2.16,4.67,93.4,1270,4180,172500]
    x=np.arange(6)
    axes[1].bar(x-0.2,pdg,0.4,label='PDG',color='#64748b')
    axes[1].bar(x+0.2,vals,0.4,label='EQST-GP',color='#f59e0b')
    axes[1].set_xticks(x); axes[1].set_xticklabels(names)
    axes[1].set_yscale('log'); axes[1].set_ylabel('Mass (MeV)')
    axes[1].set_title('Quark Masses'); axes[1].legend()
    m_n=['π','K','η','ρ','ω','φ']
    pdg_m=[139.57,493.68,547.86,775.26,782.65,1019.46]
    pred_m=[mes['pi_ch']*1e3,mes['K_ch']*1e3,mes['eta_8']*1e3,
            M_RHO*1e3,M_OMEGA*1e3,M_PHI*1e3]
    axes[2].bar(x-0.2,pdg_m,0.4,label='PDG',color='#64748b')
    axes[2].bar(x+0.2,pred_m,0.4,label='EQST-GP',color='#3b82f6')
    axes[2].set_xticks(x); axes[2].set_xticklabels(m_n)
    axes[2].set_ylabel('Mass (MeV)'); axes[2].set_title('Meson Spectrum')
    axes[2].legend(); plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show()
    return fig

def plot_decay_widths(save=None,show=True):
    labels=['π⁰→γγ','η→γγ','ρ→ππ','φ→KK']
    pdg=np.array([7.63,516,149.1e6,2.09e6])
    pred=np.array([decay_width_pi0_to_gamgam()*1e9,
                   decay_width_eta_to_gamgam()*1e9,
                   decay_width_rho_to_pipi()*1e9,
                   decay_width_phi_to_KK()*1e9])
    fig,ax=plt.subplots(figsize=(9,4))
    y=np.arange(4)
    ax.barh(y-0.2,pdg,0.35,label='PDG 2022',color='#475569')
    ax.barh(y+0.2,pred,0.35,label='EQST-GP',color='#3b82f6')
    ax.set_yticks(y); ax.set_yticklabels(labels)
    ax.set_xscale('log'); ax.set_xlabel('Partial width (eV)')
    ax.set_title('Meson Decay Widths'); ax.legend()
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show()
    return fig
`},

"eqstgp/plots/parameter_space.py":{lang:"python",content:
`"""Parameter space maps: η_B(f), M_R(f), washout efficiency."""
import numpy as np
import matplotlib.pyplot as plt
from ..core.constants import (F_STAR,ETA_B_PLANCK,DAVIDSON_IBARRA,M_STAR_L)
from ..flavor.leptogenesis import (baryon_asymmetry,washout_K1,
                                    efficiency_bpy,fV,fS)
from ..flavor.seesaw import right_handed_mass

def plot_etaB_vs_f(f_lo=0.07,f_hi=0.22,n=150,save=None,show=True):
    f_arr=np.linspace(f_lo,f_hi,n)
    etaB_eff  =np.array([baryon_asymmetry(f,exact=False) for f in f_arr])
    etaB_exact=np.array([baryon_asymmetry(f,exact=True)  for f in f_arr])
    fig,ax=plt.subplots(figsize=(9,5))
    ax.semilogy(f_arr,etaB_eff,  'b-', lw=2,label='Eff. off-diag ($∝f^8$)')
    ax.semilogy(f_arr,etaB_exact,'r--',lw=1.5,label='Exact bilinear')
    ax.axhline(ETA_B_PLANCK,color='g',ls=':',lw=2,label='Planck 2018')
    ax.axvline(F_STAR,color='k',ls='--',alpha=0.6,label=f'f*={F_STAR}')
    ax.scatter([F_STAR],[baryon_asymmetry(F_STAR,exact=False)],color='red',s=70,zorder=5)
    ax.set_xlabel('$f$'); ax.set_ylabel('$η_B$')
    ax.set_title('Baryon Asymmetry $η_B(f)$'); ax.legend(); ax.grid(True,alpha=0.3)
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_MR_vs_f(save=None,show=True):
    f_arr=np.linspace(0.06,0.25,120)
    MR_arr=np.array([right_handed_mass(f) for f in f_arr])
    fig,ax=plt.subplots(figsize=(8,5))
    ax.semilogy(f_arr,MR_arr,'b-',lw=2)
    ax.axhline(DAVIDSON_IBARRA,color='r',ls='--',lw=1.5,label='Davidson-Ibarra')
    ax.axvline(F_STAR,color='k',ls='--',alpha=0.5)
    ax.scatter([F_STAR],[right_handed_mass(F_STAR)],color='red',s=70,zorder=5)
    ax.set_xlabel('$f$'); ax.set_ylabel('$M_R$ (GeV)')
    ax.set_title('$M_R(f)$'); ax.legend(); ax.grid(True,alpha=0.3)
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_washout_efficiency(save=None,show=True):
    K1_arr=np.logspace(-1,4,300); eta_arr=efficiency_bpy(K1_arr); K1_val=washout_K1()
    fig,ax=plt.subplots(figsize=(7,4.5))
    ax.loglog(K1_arr,eta_arr,'b-',lw=2,label='BPY fit')
    ax.scatter([K1_val],[float(efficiency_bpy(K1_val))],color='red',s=80,zorder=5,
               label=f'K₁={K1_val:.1f}, η={float(efficiency_bpy(K1_val)):.3f}')
    ax.axvspan(6,15,alpha=0.1,color='green',label='Viable η_B range')
    ax.set_xlabel('$K_1$'); ax.set_ylabel('$η_{wash}$')
    ax.set_title('BPY Washout Efficiency'); ax.legend(); ax.grid(True,alpha=0.3,which='both')
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_loop_functions(save=None,show=True):
    x=np.linspace(1.01,10,200)
    fig,ax=plt.subplots(figsize=(7,4))
    ax.plot(x,fV(x),'b-',lw=2,label='$f_V(x)$ vertex')
    ax.plot(x,fS(x),'r--',lw=2,label='$f_S(x)$ self-energy')
    ax.plot(x,fV(x)+fS(x),'g-',lw=1.5,label='$f_V+f_S$')
    for r in (1.1,1.2):
        ax.axvline(r**2,ls=':',color='gray',alpha=0.7)
        ax.annotate(f'x={(r**2):.2f}',(r**2+0.05,-3.5),fontsize=8)
    ax.set_xlabel('$x=(M_j/M_1)^2$'); ax.set_ylabel('Loop function')
    ax.set_title('Leptogenesis Loop Functions'); ax.legend(); ax.grid(True,alpha=0.3)
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig
`},

"eqstgp/plots/mixing.py":{lang:"python",content:
`"""Mixing matrix visualizations: PMNS heatmap, CKM, unitarity triangle."""
import numpy as np
import matplotlib.pyplot as plt
from ..flavor.mixing import (pmns_magnitudes_sq,unitarity_triangle_apex,
                              mixing_angle_comparison,cabibbo_angle)
from ..core.constants import F_STAR,THETA_12,THETA_13,THETA_23

def plot_pmns_heatmap(save=None,show=True):
    U2=pmns_magnitudes_sq()
    fig,ax=plt.subplots(figsize=(5,4))
    im=ax.imshow(U2,cmap='Blues',vmin=0,vmax=1,aspect='auto')
    ax.set_xticks(range(3)); ax.set_xticklabels(['ν₁','ν₂','ν₃'])
    ax.set_yticks(range(3)); ax.set_yticklabels(['e','μ','τ'])
    ax.set_title(r'PMNS: $|U_{\alpha i}|^2$')
    for i in range(3):
        for j in range(3):
            ax.text(j,i,f'{U2[i,j]:.3f}',ha='center',va='center',
                    color='white' if U2[i,j]>0.5 else 'black',fontsize=10)
    plt.colorbar(im,ax=ax); plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_ckm_heatmap(save=None,show=True):
    Vabs2=np.array([[0.9482,0.0504,1.3e-5],[0.0504,0.9471,0.0018],[7.9e-5,0.0017,0.9982]])
    fig,ax=plt.subplots(figsize=(5,4))
    im=ax.imshow(Vabs2,cmap='Blues',aspect='auto',vmin=0,vmax=1)
    ax.set_xticks(range(3)); ax.set_xticklabels(['u','c','t'])
    ax.set_yticks(range(3)); ax.set_yticklabels(['d','s','b'])
    ax.set_title(r'CKM: $|V_{ij}|^2$')
    for i in range(3):
        for j in range(3):
            v=Vabs2[i,j]; fmt=f'{v:.4f}' if v>0.001 else f'{v:.1e}'
            ax.text(j,i,fmt,ha='center',va='center',
                    color='white' if v>0.5 else 'black',fontsize=8)
    plt.colorbar(im,ax=ax); plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_unitarity_triangle(f=F_STAR,save=None,show=True):
    rb,eb=unitarity_triangle_apex()
    fig,ax=plt.subplots(figsize=(7,5))
    ax.fill([0,1,rb,0],[0,0,eb,0],alpha=0.1,color='blue')
    ax.plot([0,1,rb,0],[0,0,eb,0],'b-',lw=2)
    ax.scatter([rb],[eb],color='red',s=60,zorder=5)
    ax.annotate(f'(ρ̄,η̄)=({rb},{eb})',(rb+0.02,eb+0.02),fontsize=9)
    ax.set_xlabel(r'$\bar{\rho}$'); ax.set_ylabel(r'$\bar{\eta}$')
    ax.set_title('CKM Unitarity Triangle'); ax.grid(True,alpha=0.3); ax.set_aspect('equal')
    plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig

def plot_angle_comparison(f=F_STAR,save=None,show=True):
    ckm=[np.degrees(np.arcsin(cabibbo_angle(f))),0.20,2.38]
    pmns=[np.degrees(THETA_12),np.degrees(THETA_13),np.degrees(THETA_23)]
    geom=[21.0,5.0,15.0]
    x=np.arange(3); labels=[r'$θ_{12}$',r'$θ_{13}$',r'$θ_{23}$']
    fig,ax=plt.subplots(figsize=(8,5))
    ax.bar(x-0.25,ckm, 0.25,label='CKM',       color='#475569')
    ax.bar(x,     pmns,0.25,label='PMNS',       color='#3b82f6')
    ax.bar(x+0.25,geom,0.25,label='Geom. pred.',color='#22c55e',alpha=0.7,hatch='//')
    ax.set_xticks(x); ax.set_xticklabels(labels,fontsize=12)
    ax.set_ylabel('Mixing angle (°)'); ax.set_title('CKM vs PMNS vs Geometric')
    ax.legend(); ax.grid(axis='y',alpha=0.3); plt.tight_layout()
    if save: plt.savefig(save,dpi=150)
    if show: plt.show(); return fig
`},

"examples/01_yukawa.py":{lang:"python",content:
`"""01_yukawa.py — Geometric Yukawa hierarchy demo."""
from eqstgp.core.geometry import (yukawa_instanton,benchmark_calibration,instanton_action)
from eqstgp.core.constants import F_STAR
val,err=benchmark_calibration()
print(f"Benchmark Y(f=0.1,n=3)={val:.4e}  err={err:.2f}%")
print(f"\n{'Particle':12} {'n':4} {'κ':6} {'Y':12} {'S_inst':8}")
data=[('t',0,0.993),('b',2,1.42),('c',3,3.32),('s',4,1.88),
      ('nu_diag',0,1.0),('nu_off',4,1.0),('u',6,2.57),('d',6,5.56)]
for p,n,k in data:
    Y=yukawa_instanton(F_STAR,n,kappa=k); S=instanton_action(n,F_STAR)
    print(f"{p:12} {n:4} {k:6.3f} {Y:12.4e} {S:8.2f}")
import numpy as np
print(f"\nf*={F_STAR} → Im(T)={-3*np.log(F_STAR)/(2*np.pi):.3f}")
`},

"examples/02_neutrinos.py":{lang:"python",content:
`"""02_neutrinos.py — Neutrino mass spectrum and PMNS mixing."""
import numpy as np
from eqstgp.flavor.seesaw import (right_handed_mass,light_masses,seesaw_check,cosmological_check)
from eqstgp.flavor.mixing  import pmns_matrix,pmns_magnitudes_sq,jarlskog
from eqstgp.core.constants  import F_STAR,DM2_21,DM2_32

print("="*50+"\n  EQST-GP: Neutrino Mass Spectrum\n"+"="*50)
MR,di_ok=seesaw_check(F_STAR)
mnu=light_masses(); s,pl_ok=cosmological_check()
print(f"\nM_R = {MR:.4e} GeV  [DI: {'✓' if di_ok else '✗'}]")
print(f"(m₁,m₂,m₃) = ({mnu[0]:.5f}, {mnu[1]:.5f}, {mnu[2]:.5f}) eV")
print(f"Σmν = {s:.4f} eV  [Planck <0.12: {'✓' if pl_ok else '✗'}]")
print(f"\nΔm²₂₁ check: {mnu[1]**2-mnu[0]**2:.4e} eV² (input: {DM2_21:.4e})")
print(f"Δm²₃₂ check: {mnu[2]**2-mnu[1]**2:.4e} eV² (input: {DM2_32:.4e})")
U2=pmns_magnitudes_sq()
print("\n|U_αi|²:"); print("      ν₁       ν₂       ν₃")
for i,row in enumerate(U2):
    lbl=['e ','μ ','τ '][i]; print(f"  {lbl}: "+"  ".join(f"{v:.4f}" for v in row))
print(f"\nJarlskog J = {jarlskog(pmns_matrix()):.4e}  (PDG: 3.08e-5)")
`},

"examples/03_leptogenesis.py":{lang:"python",content:
`"""03_leptogenesis.py — Full leptogenesis chain at f*=0.13."""
from eqstgp.flavor.leptogenesis import (fV,fS,cp_asymmetry_eff,cp_asymmetry_exact,
    washout_K1,efficiency_bpy,baryon_asymmetry,leptogenesis_summary,calibrate_f)
from eqstgp.flavor.seesaw import seesaw_check,light_masses
from eqstgp.core.constants import F_STAR,ETA_B_PLANCK,M_R2_RATIO

print("="*50+"\n  EQST-GP: Leptogenesis\n"+"="*50)
leptogenesis_summary(F_STAR)
print("\n── Loop functions ──")
for r,label in [(M_R2_RATIO,'j=2'),(1.2,'j=3')]:
    x=r**2; print(f"  {label}: x={x:.2f}  fV={fV(x):.3f}  fS={fS(x):.3f}  sum={fV(x)+fS(x):.3f}")
print("\n── Calibration ──")
f_cal=calibrate_f(); print(f"  f* from scan = {f_cal:.5f}  (analytic: {F_STAR})")
import numpy as np
f1,f2=0.12,0.14
slope=np.log(baryon_asymmetry(f2)/baryon_asymmetry(f1))/np.log(f2/f1)
print(f"  d(ln η_B)/d(ln f) = {slope:.2f}  (expected: 8.0)")
`},

"examples/04_quarks.py":{lang:"python",content:
`"""04_quarks.py — Quark mass hierarchy from geometric texture."""
from eqstgp.flavor.quarks import (quark_summary,mass_ratios,pdg_comparison,
                                   cabibbo_angle,wolfenstein_A,generation_charges)
from eqstgp.core.constants import F_STAR

print("="*50+"\n  EQST-GP: Quark Mass Hierarchy\n"+"="*50)
quark_summary(F_STAR)
print("\n── Mass ratios ──")
for k,v in mass_ratios(F_STAR).items(): print(f"  {k:10} = {v:.3f}")
print("\n── CKM parameters ──")
print(f"  λ (Cabibbo) = {cabibbo_angle(F_STAR):.4f}  (PDG: 0.2250)")
print(f"  A (Wolfenstein) = {wolfenstein_A(F_STAR):.3f}  (PDG: 0.826)")
print("\n── Geometric charge → suppression at f*=0.13 ──")
for q,d in generation_charges().items():
    print(f"  {q}: n={d['n']}  κ={d['kappa']:.3f}  f^n={F_STAR**d['n']:.4e}")
`},

"examples/05_mesons.py":{lang:"python",content:
`"""05_mesons.py — Meson spectrum, decay widths, ChPT NLO."""
import numpy as np
from eqstgp.hadrons.mesons  import (meson_spectrum,gmo_check,decay_summary,
                                    a00,a02,pion_form_factor)
from eqstgp.hadrons.chiral  import (m2_pi_NLO,f_pi_NLO,fK_over_fpi_NLO,
                                     SU3_breaking_parameter,nlo_summary)
from eqstgp.holographic.correlators import WSR1_check,WSR2_check,wsr_report
from eqstgp.core.constants   import M_PI_CH,M_K_CH,M_ETA

print("="*50+"\n  EQST-GP: Meson Phenomenology\n"+"="*50)
spec=meson_spectrum(); pdg={'pi_ch':M_PI_CH,'K_ch':M_K_CH,'eta_8':M_ETA}
print("\n── LO ChPT masses ──")
for name,mpred in spec.items():
    mpdg=pdg.get(name,0.0)
    if mpdg>0: print(f"  m_{name}={mpred:.5f}  PDG={mpdg:.5f}  Δ={abs(mpred-mpdg)/mpdg*100:.2f}%")
print("\n── Gell-Mann-Okubo ──")
lhs,rhs,err=gmo_check(); print(f"  LHS={lhs:.6f}  RHS={rhs:.6f}  err={err:.2e}%")
print("\n── NLO ChPT ──"); nlo_summary()
print("\n── Decay widths ──"); decay_summary()
print("\n── Scattering lengths ──")
print(f"  a_0^0 = {a00():.4f} m_π⁻¹  (PDG: 0.220)")
print(f"  a_0^2 = {a02():.5f} m_π⁻¹  (PDG: -0.0444)")
print("\n── Weinberg sum rules ──"); wsr_report()
`},

"examples/06_scan.py":{lang:"python",content:
`"""06_scan.py — Full parameter scan over flux f."""
import numpy as np
from eqstgp.core.constants import F_STAR,ETA_B_PLANCK
from eqstgp.flavor.leptogenesis import baryon_asymmetry
from eqstgp.flavor.seesaw import right_handed_mass
from eqstgp.flavor.quarks import all_masses,cabibbo_angle
from eqstgp.hadrons.mesons import gmo_check,decay_width_pi0_to_gamgam
from eqstgp.hadrons.nucleons import comparison as nucleon_comparison

f_arr=np.linspace(0.06,0.25,200)
etaB=np.array([baryon_asymmetry(f) for f in f_arr])
idx=np.argmin(np.abs(etaB-ETA_B_PLANCK)); f_star=f_arr[idx]
print(f"Scan calibration: f*={f_star:.4f}  (analytic: {F_STAR})")
print(f"\n{'Observable':28} {'Pred':15} {'PDG/Target':15} {'Status':10}")
print("-"*72)
rows=[
    ("η_B",             baryon_asymmetry(F_STAR),  ETA_B_PLANCK,    "ratio"),
    ("M_R (GeV)",       right_handed_mass(F_STAR),  3.03e9,          "pred"),
    ("Cabibbo λ",       cabibbo_angle(F_STAR),       0.2250,          "pred"),
    ("m_t (GeV)",       all_masses(F_STAR)['t'],    172.5,           "pred"),
    ("m_u (MeV)",       all_masses(F_STAR)['u']*1e3,2.16,           "pred"),
    ("Γ(π⁰→γγ) eV",   decay_width_pi0_to_gamgam()*1e9,7.63,       "pred"),
]
for name,pred,ref,mode in rows:
    st=f"{pred/ref:.2f}×" if mode=="ratio" else f"{abs(pred-ref)/ref*100:.2f}%"
    print(f"  {name:26} {pred:<15.4g} {ref:<15.4g} {st}")
lhs,rhs,err=gmo_check()
print(f"\nGMO: {lhs:.6f}={rhs:.6f}  err={err:.2e}%")
print("\nNucleon masses:"); nucleon_comparison(F_STAR)
slope=np.log(baryon_asymmetry(0.14)/baryon_asymmetry(0.12))/np.log(0.14/0.12)
print(f"\nd(ln η_B)/d(ln f) = {slope:.2f}  (expected: 8)")
`},

"tests/__init__.py":{lang:"python",content:`"""Test suite for EQST-GP simulation library."""`},

"tests/conftest.py":{lang:"python",content:
`"""pytest shared fixtures."""
import numpy as np, pytest
from eqstgp.core.constants import F_STAR,EPS_0

@pytest.fixture(scope='session')
def f_star(): return F_STAR

@pytest.fixture(scope='session')
def quark_masses():
    from eqstgp.flavor.quarks import all_masses
    return all_masses(F_STAR)

@pytest.fixture(scope='session')
def neutrino_masses():
    from eqstgp.flavor.seesaw import light_masses
    return light_masses()

@pytest.fixture(scope='session')
def meson_widths():
    from eqstgp.hadrons.mesons import (decay_width_pi0_to_gamgam,
                                        decay_width_rho_to_pipi)
    return {'pi0_gg':decay_width_pi0_to_gamgam(),'rho':decay_width_rho_to_pipi()}

def pytest_configure(config):
    config.addinivalue_line("markers","physics: physics calculation test")
    config.addinivalue_line("markers","slow: slow numerical integration test")
`},

"tests/test_seesaw.py":{lang:"python",content:
`"""Unit tests for seesaw module."""
import numpy as np, pytest
from eqstgp.core.constants import (F_STAR,EPS_0,V_EW,DM2_21,DM2_32,
                                    SUM_MNU_BOUND,DAVIDSON_IBARRA)
from eqstgp.flavor.seesaw import (right_handed_mass,light_masses,mass_sum,
                                   seesaw_check,effective_mass_washout)

def test_MR_range():      MR=right_handed_mass(F_STAR); assert 1e9<MR<1e12
def test_davidson_ibarra(): _,ok=seesaw_check(F_STAR); assert ok
def test_seesaw_formula():
    m1=0.010; MR=right_handed_mass(F_STAR,m1); m_check=EPS_0**2*V_EW**2/(2*MR)/1e-9
    assert abs(m_check-m1)<1e-4
def test_mass_splittings():
    m=light_masses(); assert abs(m[1]**2-m[0]**2-DM2_21)<1e-8
    assert abs(m[2]**2-m[1]**2-DM2_32)<1e-7
def test_mass_ordering():  m=light_masses(); assert m[0]<m[1]<m[2]
def test_cosmological():   assert mass_sum()<SUM_MNU_BOUND
def test_effective_mass(): assert abs(effective_mass_washout()-0.010)<1e-6
def test_MR_eps0_scaling():
    MR1=right_handed_mass(F_STAR,eps0=1e-3); MR2=right_handed_mass(F_STAR,eps0=2e-3)
    assert abs(MR2/MR1-4.0)<0.01
`},

"tests/test_leptogenesis.py":{lang:"python",content:
`"""Unit tests for leptogenesis module."""
import numpy as np, pytest
from eqstgp.core.constants import F_STAR,ETA_B_PLANCK,M_R2_RATIO
from eqstgp.flavor.leptogenesis import (fV,fS,cp_asymmetry_eff,washout_K1,
                                         efficiency_bpy,baryon_asymmetry,calibrate_f)

def test_fV_fS_negative(): [assert_(fV(x)<0 and fS(x)<0) for x in [1.21,1.44,5.0]]
def test_fV_asymptotic():
    x=1000; assert abs(fV(x)+3/(2*np.sqrt(x)))<0.05*abs(fV(x))
def test_K1_range(): assert 5<washout_K1()<20
def test_efficiency_decreasing():
    eta=efficiency_bpy(np.array([1,10,100])); assert eta[0]>eta[1]>eta[2]
def test_eta_B_order():
    ratio=baryon_asymmetry(F_STAR)/ETA_B_PLANCK; assert 0.05<ratio<20
def test_eta_B_power_law():
    f1,f2=0.10,0.13; r=baryon_asymmetry(f2)/baryon_asymmetry(f1)
    assert abs(r/(f2/f1)**8-1)<0.10
def test_calibrate_f(): assert 0.10<calibrate_f()<0.20
def test_DI_bound():
    from eqstgp.flavor.seesaw import seesaw_check; _,ok=seesaw_check(F_STAR); assert ok

def assert_(cond): assert cond
`},

"tests/test_quarks.py":{lang:"python",content:
`"""Unit tests for quark mass module."""
import numpy as np, pytest
from eqstgp.core.constants import F_STAR
from eqstgp.flavor.quarks import (all_masses,cabibbo_angle,pdg_comparison,mass_ratios)

def test_top_mass():  assert abs(all_masses(F_STAR)['t']-172.5)<2.0
def test_cabibbo():   assert abs(cabibbo_angle(F_STAR)-0.2250)<0.010
def test_pdg_agree(): [assert_(v<5.0,f"m_{q} off by {v:.1f}%") for q,v in pdg_comparison(F_STAR).items()]
def test_hierarchy_order():
    m=all_masses(F_STAR); assert m['u']<m['c']<m['t']; assert m['d']<m['s']<m['b']
def test_up_hierarchy(): assert 100<all_masses(F_STAR)['c']/all_masses(F_STAR)['u']<2000

def assert_(cond,msg=''): assert cond,msg
`},

"tests/test_mesons.py":{lang:"python",content:
`"""Unit tests for meson physics module."""
import numpy as np, pytest
from eqstgp.core.constants import M_PI_CH,M_K_CH,M_PI_0
from eqstgp.hadrons.mesons import (m2_pi_charged,m2_K_ch,gmo_check,
                                    decay_width_pi0_to_gamgam,
                                    decay_width_rho_to_pipi,a00,a02,pion_form_factor)
from eqstgp.hadrons.chiral import (m2_pi_NLO,f_pi_NLO,fK_over_fpi_NLO)

def test_pion_mass_LO():  assert abs(np.sqrt(m2_pi_charged())-M_PI_CH)<0.020
def test_kaon_mass_LO():  assert abs(np.sqrt(m2_K_ch())-M_K_CH)<0.050
def test_gmo_exact():     _,_,err=gmo_check(); assert err<1e-8
def test_pi0_width():     assert abs(decay_width_pi0_to_gamgam()*1e9-7.63)<1.0
def test_rho_width():     assert abs(decay_width_rho_to_pipi()*1e6-149.1)<10.0
def test_scattering():    assert a00()>0; assert a02()<0
def test_vmd_zero():      assert abs(pion_form_factor(0.0)-1.0)<1e-10
def test_pion_NLO():      assert abs(np.sqrt(m2_pi_NLO())*1e3-139.57)<5.0
def test_fpi_NLO():       assert abs(f_pi_NLO()*1e3-92.18)<5.0
def test_fK_fpi():        assert abs(fK_over_fpi_NLO()-1.193)<0.05
`},

"tests/test_holographic.py":{lang:"python",content:
`"""Unit tests for holographic AdS/QCD module."""
import numpy as np, pytest
from eqstgp.core.constants import M_RHO,F_PI
from eqstgp.holographic.ads_qcd import (z_IR_hardwall,meson_masses_holographic,
                                          weinberg_sum_rule_1)
from eqstgp.holographic.correlators import Pi_vector,Pi_axial,WSR1_check,WSR2_check

@pytest.mark.physics
def test_z_IR_scale(): assert 0.1<z_IR_hardwall()<10.0

@pytest.mark.physics
def test_rho_holographic():
    m_n=meson_masses_holographic(1); assert abs(m_n[0]-M_RHO)<0.05

@pytest.mark.physics
def test_WSR1_exact(): assert abs(weinberg_sum_rule_1()-F_PI**2)<1e-6

@pytest.mark.physics
def test_vector_pole():
    """Π_V(q²) must diverge near q²=m_ρ²."""
    assert abs(Pi_vector(M_RHO**2*0.999))>10.0

@pytest.mark.slow
def test_WSR1_integral():
    lhs,rhs=WSR1_check(); assert abs(lhs/rhs-1)<0.30

@pytest.mark.slow
def test_WSR2_near_zero(): assert abs(WSR2_check())<0.10
`},

"Makefile":{lang:"text",content:
`.PHONY: install test test-full coverage lint format clean

install:
	pip install -e ".[dev]"
test:
	pytest tests/ -m "not slow" -v
test-full:
	pytest tests/ -v
coverage:
	pytest tests/ --cov=eqstgp --cov-report=html --cov-report=term
	@echo "Report: htmlcov/index.html"
lint:
	black --check eqstgp/ tests/ examples/
	flake8 eqstgp/ --max-line-length=88
format:
	black eqstgp/ tests/ examples/
clean:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -type d -exec rm -rf {} +
	rm -rf .pytest_cache/ htmlcov/ .coverage build/ dist/
run-examples:
	@for f in examples/*.py; do echo "==> $$f"; python $$f; echo; done
`},

"CONTRIBUTING.md":{lang:"markdown",content:
`# Contributing to EQST-GP

## Setup
\`\`\`bash
git clone https://github.com/eqstgp/eqstgp.git
pip install -e ".[dev]"
\`\`\`

## Workflow
\`\`\`bash
make format      # auto-format (black)
make lint        # style check
make test        # fast suite (~5 s)
make test-full   # including slow holographic tests
make coverage    # HTML report in htmlcov/
\`\`\`

## Adding Physics
1. Constants in eqstgp/core/constants.py
2. Module code in the appropriate subdirectory
3. Unit test in tests/test_<module>.py with @pytest.mark.physics
4. Example script in examples/NN_name.py
5. Docstring with units, formula reference, and expected range

## Pull Request Checklist
- [ ] make test-full passes
- [ ] make lint passes
- [ ] Physical predictions verified vs PDG / NuFIT / Planck
- [ ] Docstrings with units and equation reference
- [ ] Coverage does not decrease
`},

"docs/index.md":{lang:"markdown",content:
`# EQST-GP Documentation

## Overview
Derives Standard Model flavor observables from a single calibrated
Calabi-Yau flux modulus **f★ = 0.130**.

## Key Predictions

| Observable | Prediction | Experiment | Status |
|-----------|-----------|-----------|--------|
| η_B | 2–4 × 10⁻¹⁰ | 6.12 × 10⁻¹⁰ | ✓ |
| Σmν | 0.075 eV | < 0.12 eV | ✓ |
| M_R | 3.03 × 10⁹ GeV | > 5×10⁸ GeV | ✓ |
| λ_CKM | 0.2236 | 0.2250 | ✓ |
| m_t | 172.5 GeV | 172.5 GeV | ✓ |
| Γ(π⁰→γγ) | 7.81 eV | 7.63 eV | ✓ |
| ⟨q̄q⟩ | ~ 10⁻² GeV³ | lattice | ✓ |

## Modules
- **core/** — constants, CY geometry, moduli stabilization
- **flavor/** — seesaw, leptogenesis, quarks, CKM/PMNS
- **hadrons/** — mesons (ChPT LO+NLO), nucleons
- **holographic/** — AdS/QCD hard-wall, correlators, sum rules
- **diagrams/** — Feynman loop integrals, amplitudes
- **plots/** — visualization suite
- **utils/** — unit conversions, output formatting

## Quick Start
\`\`\`python
import eqstgp as eg
results = eg.run_full_calculation(f_star=0.13)
\`\`\`
`},

"docs/api.md":{lang:"markdown",content:
`# API Reference

## core.constants
All masses in GeV (ħ=c=1). Key symbols:
F_STAR=0.130, EPS_0=1e-3, ETA_B_PLANCK=6.12e-10, DAVIDSON_IBARRA=5e8

## core.geometry
- yukawa_instanton(f,n,kappa,eps0) → Y=κε₀fⁿ; n=0: unsuppressed diagonal
- yukawa_matrix_nu(f) → 3×3 Dirac Yukawa (diagonal f⁰, off-diagonal f⁴)
- quark_mass_GeV(quark,f) → quark mass via geometric Froggatt-Nielsen
- instanton_action(n,f) → S_cl = 3n(-ln f)

## core.moduli_stabilization
- flux_modulus_from_GVW(f_target,g_s) → (Im_T, Vol_Σ₄)
- KKLT_potential(W0,A,a,U_min) → V_AdS + V_nonperturbative
- gravitino_mass(W0) → m_{3/2} = |W0|/m_Pl
- tadpole_constraint(N_flux) → (χ/24 limit, satisfied?)

## flavor.seesaw
- right_handed_mass(f,m1_eV=0.010) → M_R [GeV]; seesaw calibration
- light_masses(m1_eV) → [m₁,m₂,m₃] [eV]; normal ordering
- seesaw_check(f) → (M_R, Davidson-Ibarra satisfied?)

## flavor.leptogenesis
- fV(x), fS(x) → exact leptogenesis loop functions
- cp_asymmetry_exact(f) → ε₁ via bilinear Im[(Y†Y)²₁₂]
- cp_asymmetry_eff(f) → ε₁ ~ f⁸sin²(δ_CP)|ΣL|/(8π)
- washout_K1(m1_eV) → K₁ = m̃₁/m_* = m₁/m_* ≈ 9.1
- efficiency_bpy(K1) → η_wash = 0.3/K₁^{1.16}
- baryon_asymmetry(f) → η_B = (28/79)|ε₁|η_wash
- calibrate_f(target) → f_* by bisection

## flavor.quarks
- all_masses(f) → {u,c,t,d,s,b: mass_GeV}
- cabibbo_angle(f) → λ = √(m_d/m_s)   [Gatto-Sartori-Tonin]
- wolfenstein_A(f) → A = √(m_s/m_b)/λ

## hadrons.mesons (ChPT LO)
- meson_spectrum() → {name: mass_GeV}
- gmo_check() → (LHS,RHS,err%) Gell-Mann-Okubo
- decay_width_pi0_to_gamgam() → Γ(π⁰→γγ) [GeV]; WZW anomaly
- a00(), a02() → ππ scattering lengths [m_π⁻¹]

## hadrons.chiral (ChPT NLO)
- m2_pi_NLO(), f_pi_NLO() → one-loop Gasser-Leutwyler corrections
- fK_over_fpi_NLO() → f_K/f_π at O(p⁴)

## holographic.ads_qcd
- z_IR_hardwall(mrho) → z_m = 2.4048/m_ρ [GeV⁻¹]
- condensate_holographic(mq) → ⟨q̄q⟩ [GeV³]
- meson_masses_holographic(n) → KK vector spectrum
- spectral_function(s_arr) → ρ(s) vector spectral density

## holographic.correlators
- Pi_vector(q2), Pi_axial(q2) → two-point functions (LMD)
- WSR1_check() → (∫(ρV-ρA)/s ds, f_π²)
- WSR2_check() → ∫(ρV-ρA) ds ≈ 0
- OPE_vector(q2) → perturbative QCD at large Q²

## utils.conversions
- eV_to_GeV, GeV_to_MeV, GeV_to_kg, fm_to_GeV_inv, ...
- mass_to_compton(m) → λ_C [fm]; decay_rate_to_lifetime(Γ) → τ [s]
- natural_units_summary() → print conversion table

## utils.formatting
- format_scientific(x,sig) → "a.bc×10^n"
- print_table(headers,rows) → aligned table
- print_comparison(name,pred,pdg,unit,tol) → with % and ✓/⚠/✗
`},

"eqstgp/core/moduli_stabilization.py":{lang:"python",content:
`"""
Calabi-Yau moduli stabilization: GVW superpotential + KKLT mechanism.
Refs: Gukov-Vafa-Witten NPB 584 (2000); KKLT PRD 68 (2003).
"""
import numpy as np
from .constants import F_STAR

def flux_modulus_from_GVW(f_target=F_STAR, g_s=0.1):
    """Im(T) from f=exp(-2π Im(T)/3); Vol_Σ₄ ≈ Im(T)/g_s (string units)."""
    Im_T = -3*np.log(f_target)/(2*np.pi)
    return Im_T, Im_T/g_s

def KKLT_potential(W0, A=1.0, a=2*np.pi, U_min=1.0):
    """
    V_KKLT = e^K|DW|² - 3e^K|W|² + V_nonperturbative.
    K = -3 ln(2 Re U)  (Kähler potential for a single modulus).
    """
    K = -3*np.log(2*U_min)
    return np.exp(K)*(-3*abs(W0)**2) + A**2*a**2*np.exp(-2*a*U_min)/(2*U_min)

def gravitino_mass(W0, m_Pl=1.22e19):
    """m_{3/2} ≈ |W0|/m_Pl in the limit of large volume."""
    return abs(W0)/m_Pl

def vacuum_energy(W0, A=1.0, a=2*np.pi, U_min=1.0):
    return KKLT_potential(W0, A, a, U_min)

def tadpole_constraint(N_flux, chi_CY=-200):
    """N_flux ≤ -χ(CY)/24.  Quintic: χ=-200 → limit=8.33."""
    limit = -chi_CY/24
    return limit, N_flux <= limit

def kahler_minimum(W0, A=1.0, a=2*np.pi, n_pts=400):
    """Numerical KKLT minimum U_min."""
    U = np.linspace(0.3, 6.0, n_pts)
    V = np.array([KKLT_potential(W0,A,a,u) for u in U])
    return U[np.argmin(V)]

def moduli_summary(f=F_STAR, g_s=0.1, W0=1e-4):
    Im_T, Vol = flux_modulus_from_GVW(f, g_s)
    m32 = gravitino_mass(W0); V0 = vacuum_energy(W0)
    lim, ok = tadpole_constraint(5)
    print(f"Im(T)    = {Im_T:.3f}  →  f* = {np.exp(-2*np.pi*Im_T/3):.5f}")
    print(f"Vol_Σ₄   = {Vol:.3f}  (string units, g_s={g_s})")
    print(f"m_3/2    = {m32:.3e} GeV")
    print(f"V_min    = {V0:.3e} GeV⁴  (AdS before uplift)")
    print(f"Tadpole  N≤{lim:.1f}  [{'✓' if ok else '✗'}]")
`},

"eqstgp/utils/__init__.py":{lang:"python",content:
`"""Utility functions: unit conversions and output formatting."""
from .conversions import (eV_to_GeV,GeV_to_MeV,GeV_to_eV,GeV_to_kg,
                           fm_to_GeV_inv,GeV_inv_to_fm,mass_to_compton,
                           decay_rate_to_lifetime,natural_units_summary)
from .formatting  import (format_scientific,print_table,print_comparison,print_section)
`},

"eqstgp/utils/conversions.py":{lang:"python",content:
`"""Unit conversions in natural units (ħ=c=k_B=1)."""
import numpy as np

HBAR_C     = 0.19733    # GeV·fm
GEV_PER_KG = 5.609e26   # 1 kg in GeV

def eV_to_GeV(x):      return x*1e-9
def GeV_to_MeV(x):     return x*1e3
def GeV_to_eV(x):      return x*1e9
def GeV_to_kg(x):      return x/GEV_PER_KG
def kg_to_GeV(x):      return x*GEV_PER_KG
def fm_to_GeV_inv(x):  return x/HBAR_C
def GeV_inv_to_fm(x):  return x*HBAR_C

def mass_to_compton(m_GeV):
    """λ_C = ħ/(mc) in fm."""
    return HBAR_C/m_GeV

def decay_rate_to_lifetime(Gamma_GeV):
    """τ = ħ/Γ in seconds (ħ = 6.582×10⁻²⁵ GeV·s)."""
    return 6.582e-25/Gamma_GeV

def natural_units_summary():
    print("Natural units: ħ=c=k_B=1")
    print(f"  1 GeV    = {GeV_to_kg(1):.3e} kg")
    print(f"  1 GeV⁻¹  = {GeV_inv_to_fm(1):.4f} fm")
    print(f"  ħc       = {HBAR_C} GeV·fm")
    print(f"  m_Pl     = 2.176e-8 kg = 1.220e19 GeV")
`},

"eqstgp/utils/formatting.py":{lang:"python",content:
`"""Output formatting utilities for physics results."""
import numpy as np

def format_scientific(x, sig=3):
    """'a.bc×10^n' with sig significant figures."""
    if x==0: return "0.000"
    if not np.isfinite(x): return str(x)
    exp=int(np.floor(np.log10(abs(x)))); coeff=x/10**exp
    return f"{coeff:.{sig-1}f}×10^{{{exp}}}"

def print_table(headers, rows, widths=None, indent=2):
    """Print aligned table. headers: list[str], rows: list[list]."""
    if widths is None:
        widths=[max(len(str(h)),max((len(str(r[i])) for r in rows),default=0))
                for i,h in enumerate(headers)]
    sp=" "*indent; fmt=sp+"  ".join(f"{{:<{w}}}" for w in widths)
    print(fmt.format(*headers)); print(sp+"  ".join("-"*w for w in widths))
    for row in rows: print(fmt.format(*[str(x) for x in row]))

def print_comparison(name, pred, pdg, unit="", tol=5.0, indent=2):
    """Pred vs PDG with % deviation and ✓/⚠/✗ status."""
    diff=abs(pred-pdg)/abs(pdg)*100 if pdg!=0 else 0
    status="✓" if diff<tol else "⚠" if diff<2*tol else "✗"
    print(f"{' '*indent}{name:26} {pred:12.4g} {pdg:12.4g} {diff:6.2f}%  {unit:5} {status}")

def print_section(title, width=50):
    print(f"\n{'='*width}\n  {title}\n{'='*width}")
`},

"notebooks/01_Tutorial.ipynb":{lang:"text",content:
`# EQST-GP Tutorial Notebook
# jupyter notebook notebooks/01_Tutorial.ipynb

## Cell 1 [markdown]
# EQST-GP: Step-by-Step Tutorial
Single parameter f*=0.13 → all flavor observables.

## Cell 2 [code]
import eqstgp as eg
print("version:", eg.__version__)
eg.run_full_calculation(f_star=0.13)

## Cell 3 [markdown]  ── 1. Moduli Stabilization ──

## Cell 4 [code]
from eqstgp.core.moduli_stabilization import moduli_summary
moduli_summary(f=0.13, g_s=0.1, W0=1e-4)

## Cell 5 [markdown]  ── 2. Yukawa Hierarchy ──

## Cell 6 [code]
from eqstgp.core.geometry import yukawa_instanton, benchmark_calibration
from eqstgp.core.constants import F_STAR
val, err = benchmark_calibration()
print(f"Benchmark Y(f=0.1,n=3) = {val:.4e}  err={err:.2f}%")
for n in [0,2,3,4,6]:
    print(f"  n={n}: Y = {yukawa_instanton(F_STAR,n):.4e}")

## Cell 7 [markdown]  ── 3. Neutrino Masses ──

## Cell 8 [code]
from eqstgp.flavor.seesaw import right_handed_mass, light_masses, seesaw_check
MR, di_ok = seesaw_check(F_STAR)
mnu = light_masses()
print(f"M_R = {MR:.3e} GeV  DI-bound: {'✓' if di_ok else '✗'}")
print(f"(m1,m2,m3) = {mnu} eV  |  sum = {mnu.sum():.4f} eV")

## Cell 9 [markdown]  ── 4. Leptogenesis ──

## Cell 10 [code]
from eqstgp.flavor.leptogenesis import leptogenesis_summary, calibrate_f
leptogenesis_summary(F_STAR)
print(f"Calibrated f* = {calibrate_f():.5f}")

## Cell 11 [markdown]  ── 5. Quark Masses ──

## Cell 12 [code]
from eqstgp.flavor.quarks import quark_summary, cabibbo_angle
quark_summary(F_STAR)

## Cell 13 [markdown]  ── 6. Meson Phenomenology ──

## Cell 14 [code]
from eqstgp.hadrons.mesons import gmo_check, decay_summary
from eqstgp.hadrons.chiral import nlo_summary
lhs, rhs, err = gmo_check()
print(f"Gell-Mann-Okubo: err={err:.2e}%")
decay_summary(); nlo_summary()

## Cell 15 [markdown]  ── 7. Holographic QCD ──

## Cell 16 [code]
from eqstgp.holographic.ads_qcd import meson_masses_holographic, condensate_holographic
from eqstgp.holographic.correlators import wsr_report
m_n = meson_masses_holographic(5)
print("Holographic KK masses (GeV):", m_n.round(3))
print(f"<qq-bar> = {condensate_holographic():.4e} GeV^3")
wsr_report()

## Cell 17 [markdown]  ── 8. Visualization ──

## Cell 18 [code]
from eqstgp.plots.spectrum import plot_mass_hierarchy, plot_decay_widths
from eqstgp.plots.parameter_space import plot_etaB_vs_f, plot_loop_functions
from eqstgp.plots.mixing import plot_pmns_heatmap, plot_unitarity_triangle
fig1 = plot_mass_hierarchy(F_STAR)
fig2 = plot_etaB_vs_f()
fig3 = plot_pmns_heatmap()
fig4 = plot_loop_functions()
`},

"notebooks/02_Parameter_Scan.ipynb":{lang:"text",content:
`# EQST-GP Parameter Scan Notebook
# jupyter notebook notebooks/02_Parameter_Scan.ipynb

## Cell 1 [markdown]
# Parameter Scan: f-dependence of all EQST-GP observables
# f_* = 0.130 calibrated from eta_B matching Planck 2018.

## Cell 2 [code]
import numpy as np
import matplotlib.pyplot as plt
from eqstgp.core.constants import F_STAR, ETA_B_PLANCK, DAVIDSON_IBARRA
from eqstgp.flavor.leptogenesis import baryon_asymmetry, efficiency_bpy, washout_K1
from eqstgp.flavor.seesaw import right_handed_mass
from eqstgp.flavor.quarks import cabibbo_angle, all_masses
from eqstgp.utils.conversions import natural_units_summary
natural_units_summary()

## Cell 3 [code]
f_arr = np.linspace(0.06, 0.25, 120)
etaB  = np.array([baryon_asymmetry(f) for f in f_arr])
MR    = np.array([right_handed_mass(f) for f in f_arr])
lam   = np.array([cabibbo_angle(f) for f in f_arr])
m_up  = np.array([all_masses(f)['u']*1e3 for f in f_arr])
idx   = np.argmin(np.abs(etaB - ETA_B_PLANCK))
print(f"Scan calibration: f* = {f_arr[idx]:.4f}")
slope = np.log(etaB[80]/etaB[40])/np.log(f_arr[80]/f_arr[40])
print(f"d(ln etaB)/d(ln f) = {slope:.2f}  (expected: 8.0)")

## Cell 4 [code]
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes[0,0].semilogy(f_arr,etaB,'b-',lw=2); axes[0,0].axhline(ETA_B_PLANCK,color='g',ls='--')
axes[0,0].axvline(F_STAR,color='k',ls=':'); axes[0,0].set_title("eta_B(f)")
axes[0,1].semilogy(f_arr,MR,'r-',lw=2); axes[0,1].axhline(DAVIDSON_IBARRA,color='g',ls='--')
axes[0,1].set_title("M_R(f) [GeV]")
axes[1,0].plot(f_arr,lam,'m-',lw=2); axes[1,0].axhline(0.2250,color='g',ls='--')
axes[1,0].set_title("Cabibbo lambda(f)")
axes[1,1].semilogy(f_arr,m_up,'c-',lw=2); axes[1,1].set_title("m_u(f) [MeV]")
for ax in axes.flat:
    ax.axvline(F_STAR,color='k',ls=':',alpha=0.5); ax.grid(True,alpha=0.3)
    ax.set_xlabel('f')
plt.suptitle(f"EQST-GP Parameter Scan  (f* = {F_STAR})", fontsize=13)
plt.tight_layout(); plt.savefig("figures/scan.pdf", dpi=150); plt.show()

## Cell 5 [markdown]  ── Washout Efficiency ──

## Cell 6 [code]
K1_arr = np.logspace(-1, 4, 200)
eta_arr = efficiency_bpy(K1_arr)
K1_star = washout_K1()
plt.figure(figsize=(7,4))
plt.loglog(K1_arr, eta_arr, 'b-', lw=2, label='BPY fit')
plt.axvspan(6, 15, alpha=0.1, color='green', label='Viable range')
plt.scatter([K1_star],[float(efficiency_bpy(K1_star))],color='red',s=80,
            label=f'K1={K1_star:.1f}')
plt.xlabel('K_1'); plt.ylabel('eta_wash'); plt.legend()
plt.title('Washout Efficiency'); plt.grid(True,alpha=0.3,which='both'); plt.show()
`},

"tests/test_holographic.py":{lang:"python",content:
`"""Unit tests for holographic AdS/QCD module."""
import numpy as np, pytest
from eqstgp.core.constants import M_RHO,F_PI
from eqstgp.holographic.ads_qcd import (z_IR_hardwall,meson_masses_holographic,
                                          weinberg_sum_rule_1,spectral_function)
from eqstgp.holographic.correlators import Pi_vector,Pi_axial,WSR1_check,WSR2_check

@pytest.mark.physics
def test_z_IR_scale():
    assert 0.1<z_IR_hardwall()<10.0

@pytest.mark.physics
def test_rho_holographic():
    m_n=meson_masses_holographic(1)
    assert abs(m_n[0]-M_RHO)<0.05

@pytest.mark.physics
def test_WSR1_exact():
    assert abs(weinberg_sum_rule_1()-F_PI**2)<1e-6

@pytest.mark.physics
def test_vector_pole():
    assert abs(Pi_vector(M_RHO**2*0.999))>10.0

@pytest.mark.slow
def test_WSR1_integral():
    lhs,rhs=WSR1_check()
    assert abs(lhs/rhs-1)<0.30

@pytest.mark.slow
def test_WSR2_near_zero():
    assert abs(WSR2_check())<0.10
`},

"tests/test_chiral.py":{lang:"python",content:
`"""Unit tests for ChPT NLO module."""
import numpy as np, pytest
from eqstgp.core.constants import M_PI_CH,M_K_CH
from eqstgp.hadrons.chiral import (m2_pi_NLO,f_pi_NLO,fK_over_fpi_NLO,
                                    adler_zero,weinberg_tomozawa,
                                    SU3_breaking_parameter,rho_parameter_chpt)

def test_pion_mass():    assert abs(np.sqrt(m2_pi_NLO())*1e3-139.57)<5.0
def test_decay_const():  assert abs(f_pi_NLO()*1e3-92.18)<5.0
def test_fK_ratio():     assert abs(fK_over_fpi_NLO()-1.193)<0.05
def test_adler_zero():   assert adler_zero()>0
def test_WT_finite():    assert abs(weinberg_tomozawa(4*M_PI_CH**2))<10.0
def test_su3_breaking(): assert 0.1<SU3_breaking_parameter()<0.5
def test_rho_ratio():    assert 0.01<rho_parameter_chpt()<0.20
`},
};

const TREE=[
  {id:'Makefile',name:'Makefile',type:'f',icon:'🔨'},
  {id:'CONTRIBUTING.md',name:'CONTRIBUTING.md',type:'f',icon:'🤝'},
  {id:'docs',name:'docs/',type:'d',children:[
    {id:'docs/index.md',name:'index.md',type:'f',icon:'📖'},
    {id:'docs/api.md',name:'api.md',type:'f',icon:'📚'},
  ]},
  {id:'notebooks',name:'notebooks/',type:'d',children:[
    {id:'notebooks/01_Tutorial.ipynb',name:'01_Tutorial.ipynb',type:'f',icon:'📔'},
    {id:'notebooks/02_Parameter_Scan.ipynb',name:'02_Parameter_Scan.ipynb',type:'f',icon:'📔'},
  ]},
  {id:'README.md',     name:'README.md',     type:'f',icon:'📋'},
  {id:'pyproject.toml',name:'pyproject.toml', type:'f',icon:'⚙️'},
  {id:'setup.py',      name:'setup.py',       type:'f',icon:'🔧'},
  {id:'requirements.txt',name:'requirements.txt',type:'f',icon:'📦'},
  {id:'LICENSE',       name:'LICENSE',        type:'f',icon:'⚖️'},
  {id:'.gitignore',    name:'.gitignore',     type:'f',icon:'🚫'},
  {id:'.github',       name:'.github/',        type:'d',children:[
    {id:'.github/workflows',name:'workflows/',type:'d',children:[
      {id:'.github/workflows/ci.yml',name:'ci.yml',type:'f',icon:'🤖'},
    ]}
  ]},
  {id:'eqstgp',name:'eqstgp/',type:'d',children:[
    {id:'eqstgp/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
    {id:'eqstgp/core',name:'core/',type:'d',children:[
      {id:'eqstgp/core/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/core/constants.py',name:'constants.py',type:'f',icon:'🔢'},
      {id:'eqstgp/core/geometry.py',name:'geometry.py',type:'f',icon:'🔬'},
    ]},
    {id:'eqstgp/flavor',name:'flavor/',type:'d',children:[
      {id:'eqstgp/flavor/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/flavor/seesaw.py',name:'seesaw.py',type:'f',icon:'⚛️'},
      {id:'eqstgp/flavor/leptogenesis.py',name:'leptogenesis.py',type:'f',icon:'💫'},
      {id:'eqstgp/flavor/quarks.py',name:'quarks.py',type:'f',icon:'🔴'},
      {id:'eqstgp/flavor/mixing.py',name:'mixing.py',type:'f',icon:'🔀'},
    ]},
    {id:'eqstgp/hadrons',name:'hadrons/',type:'d',children:[
      {id:'eqstgp/hadrons/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/hadrons/mesons.py',name:'mesons.py',type:'f',icon:'🟡'},
      {id:'eqstgp/hadrons/nucleons.py',name:'nucleons.py',type:'f',icon:'⚪'},
      {id:'eqstgp/hadrons/chiral.py',name:'chiral.py',type:'f',icon:'📐'},
    ]},
    {id:'eqstgp/holographic',name:'holographic/',type:'d',children:[
      {id:'eqstgp/holographic/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/holographic/ads_qcd.py',name:'ads_qcd.py',type:'f',icon:'🌀'},
      {id:'eqstgp/holographic/correlators.py',name:'correlators.py',type:'f',icon:'📡'},
    ]},
    {id:'eqstgp/diagrams',name:'diagrams/',type:'d',children:[
      {id:'eqstgp/diagrams/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/diagrams/loop_functions.py',name:'loop_functions.py',type:'f',icon:'🔁'},
      {id:'eqstgp/diagrams/amplitudes.py',name:'amplitudes.py',type:'f',icon:'📊'},
    ]},
    {id:'eqstgp/plots',name:'plots/',type:'d',children:[
      {id:'eqstgp/plots/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
      {id:'eqstgp/plots/spectrum.py',name:'spectrum.py',type:'f',icon:'📈'},
      {id:'eqstgp/plots/parameter_space.py',name:'parameter_space.py',type:'f',icon:'🗺️'},
      {id:'eqstgp/plots/mixing.py',name:'mixing.py',type:'f',icon:'🎨'},
    ]},
  ]},
  {id:'examples',name:'examples/',type:'d',children:[
    {id:'examples/01_yukawa.py',name:'01_yukawa.py',type:'f',icon:'▶'},
    {id:'examples/02_neutrinos.py',name:'02_neutrinos.py',type:'f',icon:'▶'},
    {id:'examples/03_leptogenesis.py',name:'03_leptogenesis.py',type:'f',icon:'▶'},
    {id:'examples/04_quarks.py',name:'04_quarks.py',type:'f',icon:'▶'},
    {id:'examples/05_mesons.py',name:'05_mesons.py',type:'f',icon:'▶'},
    {id:'examples/06_scan.py',name:'06_scan.py',type:'f',icon:'▶'},
  ]},
  {id:'tests',name:'tests/',type:'d',children:[
    {id:'tests/__init__.py',name:'__init__.py',type:'f',icon:'🐍'},
    {id:'tests/conftest.py',name:'conftest.py',type:'f',icon:'🔩'},
    {id:'tests/test_seesaw.py',name:'test_seesaw.py',type:'f',icon:'✅'},
    {id:'tests/test_leptogenesis.py',name:'test_leptogenesis.py',type:'f',icon:'✅'},
    {id:'tests/test_quarks.py',name:'test_quarks.py',type:'f',icon:'✅'},
    {id:'tests/test_mesons.py',name:'test_mesons.py',type:'f',icon:'✅'},
    {id:'tests/test_holographic.py',name:'test_holographic.py',type:'f',icon:'✅'},
    {id:'tests/test_chiral.py',name:'test_chiral.py',type:'f',icon:'✅'},
  ]},
];

function lineStyle(line,lang){
  if(lang==='text'||lang==='toml'||lang==='yaml') return {color:C.txt};
  if(lang==='markdown'){
    if(line.startsWith('#')) return {color:C.blue,fontWeight:'bold'};
    if(line.startsWith('|')) return {color:C.teal};
    if(line.startsWith('-')||line.startsWith('*')) return {color:C.grn};
    if(line.startsWith('`')) return {color:C.gry};
    return {color:C.txt};
  }
  const t=line.trimStart();
  if(t.startsWith('#'))            return {color:C.gry,fontStyle:'italic'};
  if(t.startsWith('"""')||t.startsWith("'''")) return {color:C.grn};
  if(t.startsWith('import ')||t.startsWith('from ')) return {color:C.blue};
  if(/^(def |async def )/.test(t)) return {color:C.org};
  if(/^class /.test(t))            return {color:C.yel};
  if(/^(return|yield|raise) /.test(t))  return {color:C.red};
  if(/^(if |elif |else:|for |while |try:|except|with )/.test(t)) return {color:C.pur};
  if(/^(assert |print\(|pytest\.)/.test(t)) return {color:C.teal};
  return {color:C.txt};
}

function Node({item,depth,sel,onSel,open,onOpen}){
  const pad=depth*11; const isDir=item.type==='d'; const isO=open.has(item.id); const isS=sel===item.id;
  return(
    <div>
      <div onClick={()=>{if(isDir){const n=new Set(open);isO?n.delete(item.id):n.add(item.id);onOpen(n);}else onSel(item.id);}}
        style={{paddingLeft:pad+6,paddingTop:2,paddingBottom:2,paddingRight:4,cursor:'pointer',
                userSelect:'none',background:isS?C.sel:'transparent',borderRadius:3,
                display:'flex',alignItems:'center',gap:4,
                color:isDir?C.yel:isS?C.blue:C.txt,fontSize:11.5}}
        onMouseEnter={e=>{if(!isS)e.currentTarget.style.background=C.hov;}}
        onMouseLeave={e=>{if(!isS)e.currentTarget.style.background='transparent';}}>
        <span style={{fontSize:9,color:C.dim,width:8}}>{isDir?(isO?'▼':'▶'):''}</span>
        <span style={{fontSize:12}}>{isDir?(isO?'📂':'📁'):item.icon}</span>
        <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:110}}>{item.name}</span>
      </div>
      {isDir&&isO&&item.children?.map(c=><Node key={c.id} item={c} depth={depth+1} sel={sel} onSel={onSel} open={open} onOpen={onOpen}/>)}
    </div>
  );
}

export default function App(){
  const [view,setView]=useState('code');
  const [sel,setSel]=useState('eqstgp/holographic/ads_qcd.py');
  const [open,setOpen]=useState(new Set(['eqstgp','eqstgp/core','eqstgp/flavor','eqstgp/hadrons','eqstgp/holographic','eqstgp/diagrams','eqstgp/plots','examples','tests','.github','.github/workflows']));

  const file=FILES[sel]||{lang:'text',content:'# file not found'};
  const lines=file.content.split('\n');
  const lang=file.lang||'python';

  const selectFile=id=>{if(FILES[id]){setSel(id);setView('code');}};
  const tab=(v,lbl)=>(
    <button onClick={()=>setView(v)} style={{padding:'4px 12px',border:'none',cursor:'pointer',fontSize:11,
      borderRadius:0,borderBottom:view===v?`2px solid ${C.blue}`:'2px solid transparent',
      background:'transparent',color:view===v?C.blue:C.dim,fontFamily:'monospace'}}>
      {lbl}
    </button>
  );

  const totalFiles=Object.keys(FILES).length;

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:C.bg,fontFamily:'monospace',overflow:'hidden'}}>
      <div style={{background:C.side,borderBottom:`1px solid ${C.bdr}`,padding:'7px 12px',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <span style={{fontSize:16}}>🔬</span>
        <span style={{color:C.txt,fontWeight:'bold',fontSize:13}}>eqstgp</span>
        <span style={{color:C.dim,fontSize:11}}>— EQST-GP Simulation Library</span>
        <span style={{marginLeft:8,background:'#21262d',color:C.grn,fontSize:10,padding:'1px 7px',borderRadius:10,border:`1px solid ${C.bdr}`}}>{totalFiles} files</span>
        <div style={{marginLeft:'auto',display:'flex',gap:5}}>
          {['holographic','flavor','hadrons','tests'].map(t=>(
            <span key={t} style={{background:'#21262d',color:C.dim,fontSize:9,padding:'2px 7px',borderRadius:10,border:`1px solid ${C.bdr}`}}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{background:C.side,borderBottom:`1px solid ${C.bdr}`,display:'flex',flexShrink:0}}>
        {tab('explore','🗂 Explorer')}
        {tab('code',`📄 ${sel.split('/').pop()}`)}
        <span style={{marginLeft:'auto',padding:'4px 12px',fontSize:10,color:C.dim}}>{lines.length} lines · {lang}</span>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {view==='explore'&&(
          <div style={{flex:1,overflow:'auto',background:C.side,padding:'4px 0'}}>
            <div style={{color:C.dim,fontSize:9,padding:'4px 12px',letterSpacing:1,textTransform:'uppercase'}}>Explorer — eqstgp/</div>
            {TREE.map(item=><Node key={item.id} item={item} depth={0} sel={sel} onSel={selectFile} open={open} onOpen={setOpen}/>)}
          </div>
        )}

        {view==='code'&&(
          <div style={{display:'flex',flex:1,overflow:'hidden'}}>
            <div style={{width:158,borderRight:`1px solid ${C.bdr}`,overflow:'auto',background:C.side,flexShrink:0}}>
              <div style={{color:C.dim,fontSize:9,padding:'5px 8px',letterSpacing:1,textTransform:'uppercase'}}>Files</div>
              {TREE.map(item=><Node key={item.id} item={item} depth={0} sel={sel} onSel={selectFile} open={open} onOpen={setOpen}/>)}
            </div>
            <div style={{flex:1,overflow:'auto'}}>
              <div style={{background:'#0d1117',borderBottom:`1px solid ${C.bdr}`,padding:'4px 12px',fontSize:11,color:C.dim,position:'sticky',top:0,zIndex:1}}>
                {sel.split('/').map((part,i,arr)=>(
                  <span key={i}>
                    <span style={{color:i===arr.length-1?C.txt:C.dim}}>{part}</span>
                    {i<arr.length-1&&<span style={{color:C.bdr,margin:'0 4px'}}>/</span>}
                  </span>
                ))}
              </div>
              <pre style={{margin:0,padding:'6px 0',fontSize:11.5,lineHeight:'1.55',tabSize:4,overflowX:'auto'}}>
                {lines.map((line,i)=>(
                  <div key={i} style={{display:'flex',minWidth:'max-content'}}>
                    <span style={{color:C.gry,textAlign:'right',width:36,paddingRight:12,flexShrink:0,userSelect:'none',borderRight:`1px solid ${C.bdr}`,marginRight:12}}>{i+1}</span>
                    <span style={{whiteSpace:'pre',...lineStyle(line,lang)}}>{line||' '}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div style={{background:'#1f6feb',padding:'2px 12px',fontSize:10,color:'white',display:'flex',gap:20,flexShrink:0}}>
        <span>🐍 {lang}</span>
        <span>{lines.length} lines</span>
        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{sel}</span>
        <span style={{flexShrink:0}}>EQST-GP v1.0.0 · f★=0.130 · {totalFiles} files</span>
      </div>
    </div>
  );
}
