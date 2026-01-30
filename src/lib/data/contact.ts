export const contactData = {
  address: {
    street: "Rua George Ohm 230 Torre A Cj 82",
    neighborhood: "Brooklin Paulista",
    city: "São Paulo",
    state: "SP",
    zipCode: "04576-020",
    country: "Brasil",
  },
  phone: {
    main: "+55 (11) 2504-7650",
    secondary: "+55 (11) 2504-7650",
  },
  email: {
    main: "contato@ness.com.br",
    support: "suporte@ness.com.br",
    careers: "carreiras@ness.com.br",
  },
  socialMedia: {
    linkedin: "https://www.linkedin.com/company/nesstec/",
  },
};

export function getFullAddress(): string {
  const { address } = contactData;
  return `${address.street}, ${address.neighborhood} - ${address.city}/${address.state} - ${address.zipCode}`;
}

export function getMainPhone(): string {
  return contactData.phone.main;
}

export function getMainEmail(): string {
  return contactData.email.main;
}
