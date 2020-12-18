import { useState } from 'react';
import { useQuery } from 'react-query';

import { getUserTheme, getAllThemes, setUserTheme } from '../data/themes';

const ThemePicker = () => {
  const [selectedTheme, setSelectedTheme] = useState(getUserTheme);

  const onChange = (e) => {
    setSelectedTheme(setUserTheme(e.target.value));
    window.location.reload();
  };

  const { isLoading, error, data: themes } = useQuery('themes', getAllThemes);

  let themePickerContent = 'Loading...';

  if (error) console.error(error);

  if (!isLoading)
    themePickerContent =
      themes.length > 0 ? (
        <select name="theme" value={selectedTheme} onChange={onChange}>
          {themes.map((theme) => (
            <option value={theme.name} key={theme.theme_id ?? 0}>
              {theme.name}
            </option>
          ))}
        </select>
      ) : (
        <small className="warning">No hay temas para mostrar</small>
      );

  return themePickerContent;
};

export default ThemePicker;
