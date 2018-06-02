export class HeatmapComponentColor {

    constructor() {
    }

    //custom Farbverlauf, gibt string/hex aus
    //hex 1 ist Farbton für untere Kante (für perc = 0)
    //hex 2 ist Farbton für obere Kante (für perc = 100)
    perc2color(hex1, hex2, perc) {
        var r1 = this.hexToR(hex1);
        var r2 = this.hexToR(hex2);
        var g1 = this.hexToG(hex1);
        var g2 = this.hexToG(hex2);
        var b1 = this.hexToB(hex1);
        var b2 = this.hexToB(hex2);
        var r = Math.round(r1 - perc * (r1 - r2) * 0.01);
        var g = Math.round(g1 - perc * (g1 - g2) * 0.01); 
        var b = Math.round(b1 - perc * (b1 - b2) * 0.01); 
        return '#' + this.rgbToHex(r,g,b);
    }

    //farbverlauf von rot nach grün, gibt string/hex aus
    perc2colorRG(perc) {
        var r, g, b = 0;
        if(perc < 50) {
            g = 255;
            r = Math.round(5.1 * perc);
        }
        else {
            r = 255;
            g = Math.round(510 - 5.10 * perc);
        }
        return '#' + this.rgbToHex(r, g, b);
    }


    //farbverlauf von blau nach rot, gibt string/hex aus
    perc2colorBR(perc) {
        var r, g, b = 0;
        g = 150;
        if(perc < 50) {
            b = 255;
            r = Math.round(5.1 * perc);
        }
        else {
            r = 255;
            b = Math.round(510 - 5.10 * perc);
        }
        return '#' + this.rgbToHex(r, g, b); 
    }


    //im Folgenden Funtionen zum Konvertieren von hex nach rgb und umgekehrt:
    rgbToHex(r, g, b) {
        return this.toHex(r)+this.toHex(g)+this.toHex(b)
    }
    
    toHex(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
    }

    hexToRgb(hex) {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return r + "," + g + "," + b;
    }

    hexToR(hex) {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        return r;
    }

    hexToG(hex) {
        var bigint = parseInt(hex, 16);
        var g = (bigint >> 8) & 255;
        return g;
    }

    hexToB(hex) {
        var bigint = parseInt(hex, 16);
        var b = bigint & 255;
        return b;
    }

}