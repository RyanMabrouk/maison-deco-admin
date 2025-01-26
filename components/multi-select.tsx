import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  Sparkles,
  Trash
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';

/**
 * Variantes pour le composant multi-sélection afin de gérer différents styles.
 * Utilise class-variance-authority (cva) pour définir différents styles basé sur la prop "variant".
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

/**
 * Props pour le composant MultiSelect
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  handleDeleteOption?: (id: string) => void;
  /**
   * Un tableau d'objets option à afficher dans le composant multi-sélection.
   * Chaque objet option a un label, une valeur et une icône optionnelle.
   */
  options: {
    /** Le texte à afficher pour l'option. */
    label: string;
    /** La valeur unique associée à l'option. */
    value: string;
    /** Composant d'icône optionnel à afficher à côté de l'option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Fonction de rappel déclenchée lorsque les valeurs sélectionnées changent.
   * Reçoit un tableau des nouvelles valeurs sélectionnées.
   */
  onValueChange: (value: string[]) => void;

  /** Les valeurs sélectionnées par défaut lors du montage du composant. */
  defaultValue?: string[];

  /**
   * Texte d'espace réservé à afficher lorsqu'aucune valeur n'est sélectionnée.
   * Optionnel, par défaut "Sélectionner des options".
   */
  placeholder?: string;

  /**
   * Durée de l'animation en secondes pour les effets visuels (par exemple, les badges qui rebondissent).
   * Optionnel, par défaut 0 (aucune animation).
   */
  animation?: number;

  /**
   * Nombre maximum d'éléments à afficher. Les éléments sélectionnés en surplus seront résumés.
   * Optionnel, par défaut 3.
   */
  maxCount?: number;

  /**
   * La modalité du popover. Lorsqu'elle est définie sur true, l'interaction avec les éléments extérieurs
   * sera désactivée et seul le contenu du popover sera visible par les lecteurs d'écran.
   * Optionnel, par défaut false.
   */
  modalPopover?: boolean;

  /**
   * Si vrai, rend le composant multi-sélection comme un enfant d'un autre composant.
   * Optionnel, par défaut false.
   */
  asChild?: boolean;

  /**
   * Noms de classes supplémentaires pour appliquer des styles personnalisés au composant multi-sélection.
   * Optionnel, peut être utilisé pour ajouter des styles personnalisés.
   */
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = 'Sélectionner des options',
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      handleDeleteOption,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (defaultValue) {
        setSelectedValues(defaultValue);
      }
    }, [defaultValue]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex h-11 w-full items-center justify-between rounded-md border border-gray-300 bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          isAnimating ? 'animate-bounce' : '',
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        {option?.label}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                        isAnimating ? 'animate-bounce' : '',
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} de plus`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-gray-300 text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder="Rechercher..."
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selectedValues.length === options.length
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>(Tout sélectionner)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem key={option.value} className="cursor-pointer">
                      <div
                        onClick={() => toggleOption(option.value)}
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span onClick={() => toggleOption(option.value)}>
                        {option.label}
                      </span>
                      {handleDeleteOption && (
                        <div
                          role="button"
                          className="absolute right-2 top-2 hover:text-red-500"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteOption(option.value);
                          }}
                        >
                          <Trash className="size-4 " />
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 cursor-pointer justify-center"
                      >
                        Effacer
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex h-full min-h-6"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="max-w-full flex-1 cursor-pointer justify-center"
                  >
                    Fermer
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <Sparkles
            className={cn(
              'my-2 h-3 w-3 cursor-pointer bg-background text-foreground',
              isAnimating ? '' : 'text-muted-foreground'
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
