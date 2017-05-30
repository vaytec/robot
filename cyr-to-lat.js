const cyrTag = () => {
	
	// Таблица транслитирации в том виде, в котором она принята на golos.io:
  const _associations = {
    "а": "a",
    "б": "b",
    "в": "v",
    "ґ": "g",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "є": "ye",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "і": "i",
    "ї": "yi",
    "й": "ij",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "x": "kh",
    "ц": "cz",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "xx",
    "ы": "y",
    "ь": "x",
    "э": "ye",
    "ю": "yu",
    "я": "ya",
    "ґ": "g",
    "і": "i",
    "є": "e",
    "ї": "i"
  };

  return {
    transform: transform
  }

  function transform(str, spaceReplacement) {
    if (!str) {
      return "";
    }
    let new_str = '';
    let ru = ''
    for (let i = 0; i < str.length; i++) {
      let strLowerCase = str[i].toLowerCase();

      if (strLowerCase === " " && spaceReplacement) {
        new_str += spaceReplacement;

        continue;
      }

      if (!_associations[strLowerCase]) {
        new_str += strLowerCase;
      } else {
        new_str += _associations[strLowerCase];
		// Если в теге найдены русские символы - стало быть нам нужно добавить префикс ru-- для публикации на голосе
        ru = 'ru--';
      }
    }
    return ru + new_str;
  }
};

// Теперь мы сможем транслитировать теги подобным образом: cyrTag().transform('Тег на русском', "-")) 
