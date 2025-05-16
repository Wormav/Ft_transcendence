import React, { useState } from 'react';
import PongStyle from '../PongStyle';
import { useTranslation } from '../../../context/TranslationContext';
import type { TournamentMatchProps } from '../../../types/TournamentMatch';

export const TournamentMatchDialog: React.FC<TournamentMatchProps> = ({
  isOpen,
  onClose,
  onStartMatch
}) => {
  const { t } = useTranslation();
  const [matchId, setMatchId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchId.trim()) {
      onStartMatch(matchId.trim());
    }
  };

  return (
    <div className={PongStyle.overlay}>
      <div className={PongStyle.settingsSection}>
        <h2 className={PongStyle.settingsTitle}>{t('pong.tournamentMatch')}</h2>
        <form onSubmit={handleSubmit}>
          <div className={PongStyle.settingGroup}>
            <label>{t('pong.matchId')}</label>
            <input
              type="text"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className={PongStyle.input}
              placeholder={t('pong.enterMatchId')}
              required
            />
          </div>
          <button type="submit" className={PongStyle.button}>
            {t('pong.startTournamentMatch')}
          </button>
          <button type="button" className={PongStyle.buttonDanger} onClick={onClose}>
            {t('pong.cancel')}
          </button>
        </form>
      </div>
    </div>
  );
};
