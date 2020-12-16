#include "BPM.h"
int TempNum = 0, SYS = 0, DIA = 0, PPM = 0;

void bpm() {
    for (int i = 0; i < 4; i++) {
        PORTD.DIR ^= PIN7_bm;
        DELAY_milliseconds(100);
    }
    char data[20] = "";
    while (TempNum != 16) {
        while (USART1_IsRxReady()) {
            char c = USART1_Read();
            if ((c >= 'a' && c <= 'z')) sprintf(data, "%s%c", data, c);
            else if (c == '\n') {
                if (strstr(data, "endtest") != NULL) {
                    while (TempNum != 16) {
                        if (USART1_IsRxReady()) {
                            c = USART1_Read();
                            switch (c) {
                                case '0' ... '9':
                                    TempNum += (c - 48)*(TempNum > 15 ? 1 : 16);
                                    break;
                                case 'A' ... 'F':
                                    TempNum += (c - 55)*(TempNum > 15 ? 1 : 16);
                                    break;
                                case '\r':
                                    SYS == 0 ? SYS = TempNum : DIA == 0 ? (DIA = TempNum) : (PPM = TempNum);
                                    TempNum = 0;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                } else sprintf(data, "%s", "");
            }
        }
    }
}