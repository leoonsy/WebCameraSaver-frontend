import type { PluralizationRulesMap } from 'vue-i18n';

const pluralRules: PluralizationRulesMap = {
  // see https://vue-i18n-next.intlify.dev/guide/essentials/pluralization.html#custom-pluralization
  ru: (choice, choicesLength) => {
    if (choice === 0) {
      return 0;
    }

    const teen = choice > 10 && choice < 20;
    const endsWithOne = choice % 10 === 1;

    if (!teen && endsWithOne) {
      return 1;
    }

    if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
      return 2;
    }

    return choicesLength < 4 ? 2 : 3;
  },
};

export default pluralRules;
