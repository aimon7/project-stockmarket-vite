import { Paper, PaperProps, Typography } from '@mui/material';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ISearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

const SearchNotFound: FC<ISearchNotFoundProps> = ({ searchQuery = '', ...other }) => {
  const { t } = useTranslation();

  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {t('autocomplete.not_found')}
      </Typography>
      <Typography variant="body2" align="center">
        {t('autocomplete.no_results')}
        <strong>&quot;{searchQuery}&quot;</strong>.&nbsp;{t('autocomplete.try_again')}
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2">{t('autocomplete.please_enter_keywords')}</Typography>
  );
}

export default SearchNotFound;