[11:09 am, 19/11/2022] ~hate Me~: [{"id":"6ed1189c17ed0439","type":"tab","label":"Flow 1","disabled":false,"info":"","env":[]},{"id":"ce1790a002f55f3a","type":"ibmiot in","z":"6ed1189c17ed0439","authentication":"apiKey","apiKey":"bf9996433728395e","inputType":"evt","logicalInterface":"","ruleId":"","deviceId":"BIN1ID","applicationId":"","deviceType":"BIN1","eventType":"+","commandType":"","format":"json","name":"IBM IoT","service":"registered","allDevices":"","allApplications":"","allDeviceTypes":false,"allLogicalInterfaces":"","allEvents":true,"allCommands":"","allFormats":"","qos":0,"x":250,"y":180,"wires":[["b678812da97d9d1a","f720c62cad238799","35b263513ea4f373"]]},{"id":"b678812da97d9d1a","type":"debug","z":"6ed1189c17ed0439","name":"msg.payload","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":610,"y":180,"wires":[]},{"id":"f720c62cad238799","type":"function","z":"6ed1189c17ed0439","name":"Distance 1","func":"msg.payload = msg.payload.dist\nglobal.set('d',msg.payload)\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":430,"y":220,"wires":[["5dcbaf252dc78b06","b678812da97d9d1a"]]},{"id":"35b263513ea4f373","type":"function","z":"6ed1189c17ed0439","name":"LOAD cell 1","func":"msg.payload =msg. payload.load\nglobal.set('l', msg.payload)\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":430,"y":300,"wires":[["b7ac8ba401c6cab8"]]},{"id":"5de18859cabb1a5d","type":"http in","z":"6ed1189c17ed0439","name":"","url":"/sensor","method":"get","upload":false,"swaggerDoc":"","x":210,"y":420,"wires":[["80650c336af78c61"]]},{"id":"5ab7d1be9c4e2831","type":"http response","z":"6ed1189c17ed0439","name":"","statusCode":"","headers":{},"x":710,"y":400,"wires":[]},{"id":"80650c336af78c61","type":"function","z":"6ed1189c17ed0439","name":"function 1","func":"msg.payload = { \"dist\": global.get('d'), \"load\": global.get('l')}\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":460,"y":420,"wires":[["5ab7d1be9c4e2831"]]},{"id":"e0022c1a3e189dea","type":"ibmiot in","z":"6ed1189c17ed0439","authentication":"apiKey","apiKey":"bf9996433728395e","inputType":"evt","logicalInterface":"","ruleId":"","deviceId":"BIN2ID","applicationId":"","deviceType":"BIN2","eventType":"+","commandType":"","format":"json","name":"IBM IoT","service":"registered","allDevices":"","allApplications":"","allDeviceTypes":false,"allLogicalInterfaces":"","allEvents":true,"allCommands":"","allFormats":"","qos":0,"x":250,"y":500,"wires":[["2a22e946c6d5f734","233a55d8b0e40a46","a5ed197df7ced05a"]]},{"id":"233a55d8b0e40a46","type":"function","z":"6ed1189c17ed0439","name":"Distance 2","func":"msg.payload = msg.payload.dist\nglobal.set('d',msg.payload)\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":450,"y":540,"wires":[["2a22e946c6d5f734","9b44a1863803e38a"]]},{"id":"a5ed197df7ced05a","type":"function","z":"6ed1189c17ed0439","name":"LOAD cell 2","func":"msg.payload =msg. payload.load\nglobal.set('l', msg.payload)\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":450,"y":600,"wires":[["40ccb32035a0f55f"]]},{"id":"2a22e946c6d5f734","type":"debug","z":"6ed1189c17ed0439","name":"msg.payload","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":650,"y":480,"wires":[]},{"id":"60298a7291818343","type":"http in","z":"6ed1189c17ed0439","name":"","url":"/sensor","method":"get","upload":false,"swaggerDoc":"","x":190,"y":660,"wires":[["616151913ceb65e2"]]},{"id":"616151913ceb65e2","type":"function","z":"6ed1189c17ed0439","name":"function 2","func":"msg.payload = { \"dist\": global.get('d'), \"load\": global.get('l')}\nreturn msg;","outputs":1,"no…
[11:09 am, 19/11/2022] ~hate Me~: Node red
[11:10 am, 19/11/2022] ~hate Me~: Skip to content
Sign up
IBM-EPBL
/
IBM-Project-39260-1660403380
Public
Code
Issues
Pull requests
Actions
Projects
Security
Insights
IBM-Project-39260-1660403380/6_Final Deliverables/Final Code Files/Weight of the bin/hx711.py
@batulr
batulr added to final1
 1 contributor
95 lines (72 sloc)  2.33 KB
from machine import Pin, enable_irq, disable_irq, idle

class HX711:
    def _init_(self, dout, pd_sck, gain=128):

        self.pSCK = Pin(pd_sck , mode=Pin.OUT)
        self.pOUT = Pin(dout, mode=Pin.IN, pull=Pin.PULL_DOWN)
        self.pSCK.value(False)

        self.GAIN = 0
        self.OFFSET = 0
        self.SCALE = 1
        
        self.time_constant = 0.1
        self.filtered = 0

        self.set_gain(gain);

    def set_gain(self, gain):
        if gain is 128:
            self.GAIN = 1
        elif gain is 64:
            self.GAIN = 3
        elif gain is 32:
            self.GAIN = 2

        self.read()
        self.filtered = self.read()
        print('Gain & initial value set')
    
    def is_ready(self):
        return self.pOUT() == 0

    def read(self):
        # wait for the device being ready
        while self.pOUT() == 1:
            idle()

        # shift in data, and gain & channel info
        result = 0
        for j in range(24 + self.GAIN):
            state = disable_irq()
            self.pSCK(True)
            self.pSCK(False)
            enable_irq(state)
            result = (result << 1) | self.pOUT()

        # shift back the extra bits
        result >>= self.GAIN

        # check sign
        if result > 0x7fffff:
            result -= 0x1000000

        return result

    def read_average(self, times=3):
        s = 0
        for i in range(times):
            s += self.read()
        ss=(s/times)/210
        return '%.1f' %(ss)

    def read_lowpass(self):
        self.filtered += self.time_constant * (self.read() - self.filtered)
        return self.filtered

    def get_value(self, times=3):
        return self.read_average(times) - self.OFFSET

    def get_units(self, times=3):
        return self.get_value(times) / self.SCALE

    def tare(self, times=15):
        s = self.read_average(times)
        self.set_offset(s)

    def set_scale(self, scale):
        self.SCALE = scale

    def set_offset(self, offset):
        self.OFFSET = offset

    def set_time_constant(self, time_constant = None):
        if time_constant is None:
            return self.time_constant
        elif 0 < time_constant < 1.0:
            self.time_constant = time_constant

    def power_down(self):
        self.pSCK.value(False)
        self.pSCK.value(True)

    def power_up(self):
        self.pSCK.value(False)
