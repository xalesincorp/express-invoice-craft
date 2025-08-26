import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  ({ value, onChange, placeholder = "Pilih waktu", disabled = false }, ref) => {
    const [open, setOpen] = React.useState(false);
    
    const generateHourOptions = () => {
      const options = [];
      for (let hour = 0; hour < 24; hour++) {
        options.push(hour.toString().padStart(2, '0'));
      }
      return options;
    };

    const generateMinuteOptions = () => {
      const options = [];
      for (let minute = 0; minute < 60; minute++) {
        options.push(minute.toString().padStart(2, '0'));
      }
      return options;
    };

    const hourOptions = generateHourOptions();
    const minuteOptions = generateMinuteOptions();

    const [selectedHour, setSelectedHour] = React.useState(value ? value.split(':')[0] : '');
    const [selectedMinute, setSelectedMinute] = React.useState(value ? value.split(':')[1] : '');

    const handleTimeChange = (hour: string, minute: string) => {
      if (hour && minute) {
        const newTime = `${hour}:${minute}`;
        onChange(newTime);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left font-normal",
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
          >
            {value || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium mb-2 block">Jam</Label>
                <Command>
                  <CommandInput placeholder="Cari jam..." />
                  <CommandEmpty>Tidak ada jam yang ditemukan.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {hourOptions.map((hour) => (
                      <CommandItem
                        key={hour}
                        value={hour}
                        onSelect={(currentValue) => {
                          setSelectedHour(currentValue);
                          handleTimeChange(currentValue, selectedMinute);
                          if (currentValue && selectedMinute) {
                            setOpen(false);
                          }
                        }}
                        className={cn(
                          "cursor-pointer",
                          selectedHour === hour && "bg-accent"
                        )}
                      >
                        {hour}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Menit</Label>
                <Command>
                  <CommandInput placeholder="Cari menit..." />
                  <CommandEmpty>Tidak ada menit yang ditemukan.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {minuteOptions.map((minute) => (
                      <CommandItem
                        key={minute}
                        value={minute}
                        onSelect={(currentValue) => {
                          setSelectedMinute(currentValue);
                          handleTimeChange(selectedHour, currentValue);
                          if (selectedHour && currentValue) {
                            setOpen(false);
                          }
                        }}
                        className={cn(
                          "cursor-pointer",
                          selectedMinute === minute && "bg-accent"
                        )}
                      >
                        {minute}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

TimePicker.displayName = "TimePicker";

export { TimePicker };