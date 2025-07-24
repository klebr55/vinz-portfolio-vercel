"use client";
import { Transition } from '@headlessui/react';
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useLocale } from 'next-intl';
import React from 'react';

// Defina os locales diretamente no componente
const locales = ['en', 'pt-br'];

const flagMap: Record<string, string> = {
  en: "fi fi-gb", // Reino Unido
  "pt-br": "fi fi-br", // Brasil
};

// Mapeamento de labels para exibição
const labelMap: Record<string, string> = {
  en: "EN",
  "pt-br": "PT-BR",
};

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [isClient, setIsClient] = useState(false);
  const [flagsLoaded, setFlagsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Carrega o CSS das bandeiras dinamicamente
    const loadFlagIcons = () => {
      // Verifica se o CSS já foi carregado
      const existingLink = document.querySelector('link[href*="flag-icons"]');
      if (existingLink) {
        setFlagsLoaded(true);
        return;
      }

      // Cria um link element para carregar o CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/css/flag-icons.min.css';
      link.onload = () => {
        setFlagsLoaded(true);
        console.log('Flag icons CSS loaded successfully');
      };
      link.onerror = () => {
        console.error('Failed to load flag icons CSS');
        setFlagsLoaded(true); // Continue mesmo se falhar
      };
      
      document.head.appendChild(link);
    };

    loadFlagIcons();
    
    const resetOverflow = () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
    window.addEventListener("click", resetOverflow, true);
    return () => window.removeEventListener("click", resetOverflow, true);
  }, []);

  const handleChange = (locale: string) => {
    if (!locales.includes(locale)) return;
    
    if (isClient) {
      window.location.href = `/${locale}`;
    }
  };

  // Renderizar apenas no cliente para evitar hydration issues
  if (!isClient || !flagsLoaded) {
    return (
      <div className="inline-flex w-full justify-center gap-x-1 rounded-lg pl-1 py-2 text-sm font-semibold text-white shadow-xs border-none">
        <span className="fi fi-us text-lg" />
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1 rounded-lg pl-1 py-2 text-sm font-semibold text-white shadow-xs border-none focus:outline-none focus:ring-0">
          <span 
            className={`${flagMap[currentLocale]} text-lg`}
            style={{ 
              display: 'inline-block', 
              width: '24px', 
              height: '20px',
              backgroundSize: 'cover'
            }}
          />
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-350"
        enterFrom="opacity-0 scale-95 -translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 -translate-y-2"
      >
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-1">
            {locales.map((lng) => (
              <MenuItem key={lng}>
                <button
                  onClick={() => handleChange(lng)}
                  className={`block w-full px-4 py-3 text-left text-sm text-gray-700 data-focus:bg-gray-100 hover:text-black data-focus:text-gray-900 data-focus:outline-none ${
                    currentLocale === lng ? "font-bold text-purple-600" : ""
                  }`}
                >
                  <div className='flex flex-row items-center gap-3'>
                    <span 
                      className={`${flagMap[lng]} text-lg`}
                      style={{ 
                        display: 'inline-block', 
                        width: '20px', 
                        height: '15px',
                        backgroundSize: 'cover'
                      }}
                    />
                    <span>{labelMap[lng]}</span>
                  </div>
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}