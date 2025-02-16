var NIZ_FIGURA = ["top", "konj", "lovac", "dama", "kralj", "pesak"];

class Figura {
	constructor(x, y, tip, boja) {
		this.x = x;
		this.y = y;
		this.tip = tip;
		this.boja = boja;
	}
}

class Lovac extends Figura {
	constructor(x, y, tip, boja) {
		super(x, y, tip, boja);
	}
	
	proveri_potez(novo_x, novo_y) {
		var pomeraj_x = novo_x - this.x;
		var pomeraj_y = novo_y - this.y;
		
		if (Math.abs(pomeraj_x) == Math.abs(pomeraj_y)) return true;
		
		return false;
	}
	
	/*
	 * Metoda proverava da li se neka figura nalazi na putu
	 */
	proveri_putanju(novo_x, novo_y) {
		var pomeraj_x = this.x - novo_x;
		var pomeraj_y = this.y - novo_y;
		
		var i = parseInt(this.x);
		var j = parseInt(this.y);
		var ne_sadrzi_figuru = true;
		
		for (;;) {
			if (pomeraj_x < 0) i = i + 1;
			else i = i - 1;
			
			if (pomeraj_y < 0) j = j + 1;
			else j = j - 1;
			
			if (i == novo_x) break;
			
			$(".polje_div").each(function() {
				if ($(this).attr("data-pozicija_x") == i && $(this).attr("data-pozicija_y") == j) {
					if ($(this).hasClass("crni_tabor") || $(this).hasClass("beli_tabor")) {
						// postoji figura na polju
						ne_sadrzi_figuru = false;
					}
					
					return;
				}
			});
			
			if (!ne_sadrzi_figuru) break;
		}
		
		return ne_sadrzi_figuru;
	}
	
}
class Pesak extends Figura {
    constructor(x, y, tip, boja) {
        super(x, y, tip, boja);
        this.pocetna_pozicija = (this.boja === "beli_tabor" && this.y == 2) || (this.boja === "crni_tabor" && this.y == 7);
    }

    proveri_potez(novo_x, novo_y) {
        let pomeraj_x = novo_x - this.x;
        let pomeraj_y = novo_y - this.y;

        // Pravilo kretanja napred za jedno polje
        if (this.boja === "beli_tabor" && pomeraj_x === 0 && pomeraj_y === 1) return true;
        if (this.boja === "crni_tabor" && pomeraj_x === 0 && pomeraj_y === -1) return true;

        // Pravilo kretanja napred za dva polja sa početne pozicije
        if (this.boja === "beli_tabor" && this.pocetna_pozicija && pomeraj_x === 0 && pomeraj_y === 2) return true;
        if (this.boja === "crni_tabor" && this.pocetna_pozicija && pomeraj_x === 0 && pomeraj_y === -2) return true;

        // Pravilo jedenja dijagonalno
        if (this.boja === "beli_tabor" && Math.abs(pomeraj_x) === 1 && pomeraj_y === 1) return true;
        if (this.boja === "crni_tabor" && Math.abs(pomeraj_x) === 1 && pomeraj_y === -1) return true;

        return false;
    }

    proveri_putanju(novo_x, novo_y) {
        // Pešak može samo da "jede" dijagonalno ako je protivnička figura na tom polju
        if (Math.abs(novo_x - this.x) === 1 && Math.abs(novo_y - this.y) === 1) {
            let polje_je_puno = false;
            $(".polje_div").each(function () {
                if ($(this).attr("data-pozicija_x") == novo_x && $(this).attr("data-pozicija_y") == novo_y) {
                    if ($(this).hasClass("crni_tabor") || $(this).hasClass("beli_tabor")) {
                        polje_je_puno = true;
                    }
                }
            });
            return polje_je_puno;
        }

       // Ako ide pravo napred, mora biti prazno
       if (Math.abs(novo_x - this.x) === 0) {
        return !$(".polje_div").filter((_, el) => {
            return $(el).attr("data-pozicija_x") == novo_x && $(el).attr("data-pozicija_y") == novo_y &&
                ($(el).hasClass("crni_tabor") || $(el).hasClass("beli_tabor"));
        }).length; // Proverava da li je polje prazno
    }

    return false; // Ne važi za druge poteze
    }

    
}



class Konj extends Figura {
    constructor(x, y, tip, boja) {
        super(x, y, tip, boja);
    }

    proveri_potez(novo_x, novo_y) {
        let pomeraj_x = Math.abs(novo_x - this.x);
        let pomeraj_y = Math.abs(novo_y - this.y);

        // Pravilo kretanja u obliku slova "L"
        if ((pomeraj_x === 2 && pomeraj_y === 1) || (pomeraj_x === 1 && pomeraj_y === 2)) {
            return true;
        }

        return false;
    }

    proveri_putanju(novo_x, novo_y) {
        // Konj može preskočiti druge figure, tako da ne treba proveravati putanju
        return true;
    }
}

class Top extends Figura {
    constructor(x, y, tip, boja) {
        super(x, y, tip, boja);
    }

    // Provera da li je potez validan (top se kreće horizontalno ili vertikalno)
    proveri_potez(novo_x, novo_y) {
        let pomeraj_x = Math.abs(novo_x - this.x);
        let pomeraj_y = Math.abs(novo_y - this.y);

        // Top se može kretati samo po istom redu (x ose) ili po istoj koloni (y ose)
        if (pomeraj_x === 0 || pomeraj_y === 0) {
            return true;
        }

        // Ako pokušava dijagonalni potez, vraća false
        return false;
    }

    // Provera da li postoji neka figura na putu između startne i krajnje pozicije
    proveri_putanju(novo_x, novo_y) {
        let polja_na_putu = [];
        let figura_na_putu = false;

        // Kretanje po y osi (vertikalno)
        if (this.x == novo_x) {
            let min_y = Math.min(this.y, novo_y);
            let max_y = Math.max(this.y, novo_y);

            // Prolazimo kroz sva polja između trenutnog i ciljanog (bez trenutnog i ciljanog)
            for (let i = min_y + 1; i < max_y; i++) {
                polja_na_putu.push({ x: this.x, y: i });
            }
        }

        // Kretanje po x osi (horizontalno)
        if (this.y == novo_y) {
            let min_x = Math.min(this.x, novo_x);
            let max_x = Math.max(this.x, novo_x);

            for (let i = min_x + 1; i < max_x; i++) {
                polja_na_putu.push({ x: i, y: this.y });
            }
        }

        // Provera da li neka figura stoji na putu
        $(".polje_div").each(function () {
            polja_na_putu.forEach(function (polje) {
                if ($(this).attr("data-pozicija_x") == polje.x && $(this).attr("data-pozicija_y") == polje.y) {
                    if ($(this).hasClass("crni_tabor") || $(this).hasClass("beli_tabor")) {
                        figura_na_putu = true; // Postoji figura na putu
                    }
                }
            }.bind(this));
        });

        // Ako nema figure na putu, potez je validan
        return !figura_na_putu;
    }
}

class Dama extends Figura {
    constructor(x, y, tip, boja) {
        super(x, y, tip, boja);
    }

    proveri_potez(novo_x, novo_y) {
        let pomeraj_x = Math.abs(novo_x - this.x);
        let pomeraj_y = Math.abs(novo_y - this.y);

        // Pravila kretanja dame: može se kretati horizontalno, vertikalno ili dijagonalno
        if (pomeraj_x === 0 || pomeraj_y === 0 || pomeraj_x === pomeraj_y) {
            return true;
        } else {
        return false;
		}
    }

    proveri_putanju(novo_x, novo_y) {
        let figura_na_putu = false;
        let polja_na_putu = [];

        // Kretanje po y osi (vertikalno)
        if (this.x === novo_x) {
            let min_y = Math.min(this.y, novo_y);
            let max_y = Math.max(this.y, novo_y);

            // Prolazimo kroz sva polja između trenutnog i ciljnog (bez trenutnog i ciljnog)
            for (let i = min_y + 1; i < max_y; i++) {
                polja_na_putu.push({ x: this.x, y: i });
            }
        }

        // Kretanje po x osi (horizontalno)
        else if (this.y === novo_y) {
            let min_x = Math.min(this.x, novo_x);
            let max_x = Math.max(this.x, novo_x);

            // Prolazimo kroz sva polja između trenutnog i ciljnog (bez trenutnog i ciljnog)
            for (let i = min_x + 1; i < max_x; i++) {
                polja_na_putu.push({ x: i, y: this.y });
            }
        }

        

        // Provera da li neka figura stoji na putu
        $(".polje_div").each(function () {
            let polje = $(this);
            polja_na_putu.forEach(function (p) {
                if (polje.attr("data-pozicija_x") == p.x && polje.attr("data-pozicija_y") == p.y) {
                    if (polje.hasClass("crni_tabor") || polje.hasClass("beli_tabor")) {
                        figura_na_putu = true;
                    }
                }
            });
        });

        return !figura_na_putu;
    }

	

    proveri_jedenje(novo_x, novo_y) {
        let polje_je_puno = false;
        let protivnicka_figura = false;

        $(".polje_div").each(function () {
            if ($(this).attr("data-pozicija_x") == novo_x && $(this).attr("data-pozicija_y") == novo_y) {
                if ($(this).hasClass("crni_tabor") || $(this).hasClass("beli_tabor")) {
                    polje_je_puno = true;
                    if (!$(this).hasClass(this.boja)) {
                        protivnicka_figura = true; // Na polju je protivnička figura
                    }
                }
            }
        });

        return polje_je_puno && protivnicka_figura;
    }
}

class Kralj extends Figura {
    constructor(x, y, tip, boja) {
        super(x, y, tip, boja);
    }

    proveri_potez(novo_x, novo_y) {
        // Kralj može da se pomeri jedno polje u bilo kom pravcu
        let pomeraj_x = Math.abs(novo_x - this.x);
        let pomeraj_y = Math.abs(novo_y - this.y);

        // Kralj se kreće samo za jedno polje u bilo kom pravcu
        if (pomeraj_x <= 1 && pomeraj_y <= 1) {
            return true;
        }

        return false;
    }

    proveri_putanju(novo_x, novo_y) {
		let polje_je_zauzeto = false;
		let figura_iste_boje = false;
	
		$(".polje_div").each(function () {
			if ($(this).attr("data-pozicija_x") == novo_x && $(this).attr("data-pozicija_y") == novo_y) {
				// Provera da li je polje zauzeto figurom
				if ($(this).hasClass("crni_tabor") || $(this).hasClass("beli_tabor")) {
					polje_je_zauzeto = true;
					// Provera da li je figura iste boje
					if ($(this).hasClass(this.boja)) {
						figura_iste_boje = true;
					}
				}
			}
		});
	
		// Kralj ne može da stane na polje zauzeto figurom iste boje
		if (figura_iste_boje) return false;
	
		// Ako polje nije zauzeto ili je zauzeto figurom protivnika, potez je dozvoljen
		return true;
	}
	
}



$(document).ready(function () {
	var odabrana_figura = null;
	var na_potezu = "beli_tabor";
	
	function ponistavanje_odabira() {
		$(".belo_polje").css("border", "2px solid transparent");
		$(".crno_polje").css("border", "2px solid transparent");
	}
	
	function prikazi_nedozvoljen_potez() {
		alert("nedozvoljen potez");
		odabrana_figura = null;
		ponistavanje_odabira();
	}
	
	$(".polje_div").on("click", function () {
		var elem = $(this);
		
		ponistavanje_odabira();
		elem.parent().css("border", "2px solid red");
		
		if (odabrana_figura != null) {
			// u prethodnom koraku je odabrana neka figura
			// da li se na polju nalazi figura iste boje
			if (elem.hasClass(odabrana_figura.boja)) {
				// nalazi se figura iste boje
				prikazi_nedozvoljen_potez();
			}
			else if (!odabrana_figura.proveri_potez(elem.attr("data-pozicija_x"), elem.attr("data-pozicija_y"))) {
				// potez nije validan
				prikazi_nedozvoljen_potez();
			}
			else if (!odabrana_figura.proveri_putanju(elem.attr("data-pozicija_x"), elem.attr("data-pozicija_y"))) {
				// figura je na putu
				prikazi_nedozvoljen_potez();
			}
			else {
				// pomeri figuru
				var prethodno_polje = null;
				
				$(".polje_div").each(function() {
					if ($(this).attr("data-pozicija_x") == odabrana_figura.x && $(this).attr("data-pozicija_y") == odabrana_figura.y) {
						prethodno_polje = $(this);
						
						return;
					}
				});
				
				var figura_img = prethodno_polje.find("img");
				
				prethodno_polje.removeClass(odabrana_figura.boja).removeClass(odabrana_figura.tip);
				figura_img.remove();
				
				var stara_figura_img = elem.find("img");
				
				stara_figura_img.remove();
				elem.removeClass().addClass("polje_div");
				
				elem.append(figura_img);
				elem.addClass(odabrana_figura.boja).addClass(odabrana_figura.tip);
				
				
				if (na_potezu == "beli_tabor") na_potezu = "crni_tabor";
				else na_potezu = "beli_tabor";
				
				odabrana_figura = null;
				ponistavanje_odabira();
			}
		}
		else {
			// nema odabrane figure
			// provera da li na odabranom polju postoji figura
			NIZ_FIGURA.forEach(function (item, index) {
				if (elem.hasClass(item)) {
					// nalazi se figura
					// da li je ta boja na potezu
					if (!elem.hasClass(na_potezu)) {
						alert("nisi na potezu");
						
						return;
					}
					
					var poz_x = elem.attr("data-pozicija_x");
					var poz_y = elem.attr("data-pozicija_y");
					
					switch (item) {
						case "top":
                           odabrana_figura = new Top(poz_x, poz_y, "top", na_potezu);
                           break;
						case "konj":
							odabrana_figura = new Konj(poz_x, poz_y, "konj", na_potezu);
							break;
						case "lovac":
							odabrana_figura = new Lovac(poz_x, poz_y, "lovac", na_potezu);
							break;
						case "pesak":
							odabrana_figura = new Pesak(poz_x, poz_y, "pesak", na_potezu);
							break;
						case "dama":
							odabrana_figura = new Dama(poz_x, poz_y, "dama", na_potezu);
							break;
						case "kralj":
							odabrana_figura = new Kralj(poz_x, poz_y, "kralj", na_potezu);
							break;	
						default:
							//
					}

					return;
				}
			});
			
			
		}
	});
	
});

