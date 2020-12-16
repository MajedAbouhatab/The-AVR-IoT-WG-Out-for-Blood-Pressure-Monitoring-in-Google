import serial.tools.list_ports as ports
import serial

BaudRates=[110, 150, 300, 600, 1200, 2400, 4800, 9600,
           14400, 19200, 28800, 31250, 38400, 57600,
           115200, 128000, 230400, 256000, 460800, 921600]

for p in ports.comports():
    for b in BaudRates:
        with serial.Serial(p.device,b,timeout=3) as s:
            print(s.name + ' ' + str(s.baudrate) + ' ' +
                  s.read(100).decode('unicode_escape'))
exit()
