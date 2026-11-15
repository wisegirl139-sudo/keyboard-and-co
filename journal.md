# Journal 📓

> All of this was recorded in about one day, so I'll be writing about it in chunks. Also, this is being written on GitHub and not VS Code, so Grammarly is going to be improving my writing. Blame it if my jokes go over your head.

---

## Part 1: Starting (44 mins)

<img width="1056" height="529" alt="image" src="https://github.com/user-attachments/assets/fa92ae2e-d6a0-4f6c-a126-39e390ccbd6c" />

### Basics

I started off by putting down some of the basic things I had previously decided with Oliver:

- The MCU is an **ESP32-WROOM**
- It's obviously going to need a **USB-C receptacle**

I then attempted to freestyle the rest, but I didn't get very far once I realised I was missing *so many* of the preliminaries.

### Power

So I started on my favourite part: the power. I've made a couple of LiPo battery circuits before, following tutorials by this guy (no, I don't have a link, go away):

<img width="469" height="254" alt="image" src="https://github.com/user-attachments/assets/d66197ac-1bca-4338-8074-a8d4e35377fa" />

By "following", I mean the video told me what parts I needed, I paused it and searched for similar parts that might be cooler (I didn't find any, so I chose ones that were the same, just with different names), then unpaused and connected them using, you won't believe this, **WIRES** (buses, but who cares).

To get the connections right, I lowkey just followed what was shown on the thumbnail and what the guy in the video said. (This is being written two weeks later, so forgive my vagueness.)

This step also included an awful lot of **decoupling capacitors**. Thank you so much to the person from Gadget Market for teaching me about these!

<img width="435" height="323" alt="image" src="https://github.com/user-attachments/assets/1249df50-e236-4b87-9796-8be53dac3dde" />

*All components placed and organised.*

---

## Part 2: 63 Keys (1 hr 14 mins)

<img width="487" height="234" alt="image" src="https://github.com/user-attachments/assets/c9b8d751-24ac-43dd-a8f7-c5fc83e7347e" />

### Finishing the power section

I finished up the whole charging part, connected everything to the WROOM, and organised it, of course.

### The blunder

This is where I made a blunder. I used the cool LED and the fancy switches I'd found earlier, except I could not, for the life of me, adapt the way I usually wire switches to these kinds of switches. So I lowkey just gave up and started with the normal switch schematic and LED alongside it.

Can I just say, it was such a **PAIN**. OMDs, 63 is too many.

### The matrix

There's no way that many columns fit on the GPIO for just one component, so we used an **I2C expander** for all the columns. There were only about 5 rows, though, so those connected directly to the WROOM.

Final piece: **sheet 1, organised.**

<img width="475" height="240" alt="image" src="https://github.com/user-attachments/assets/d627c348-6534-4fd9-9a69-a8789203bd0c" />

---

## Part 3: Failure (17 mins)

I started on the F keys, I believe. I was exhausted and had no space, so I tried using the new sheet thing. But move one component and the void eats it, and when you're exhausted, that just kills you, man.

I got as far as placing a lot of what I needed and doing a bit of routing, then un-routing it because it was all wrong.

