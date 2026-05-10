import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import TrackInfo from './TrackInfo';

function renderTrackInfo(props: Partial<React.ComponentProps<typeof TrackInfo>> = {}) {
  const defaults = {
    title: 'Test Song',
    artistName: 'Test Artist',
    albumId: 42,
    hasCover: true,
    isPlaying: false,
  };
  return render(
    <MemoryRouter>
      <TrackInfo {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe('TrackInfo', () => {
  it('renders track title and artist name', () => {
    renderTrackInfo();
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders album link with aria-label', () => {
    renderTrackInfo();
    const links = screen.getAllByRole('link');
    const titleLink = links.find((l) => l.textContent === 'Test Song');
    expect(titleLink).toHaveAttribute('aria-label', 'Test Song — go to album');
  });

  it('renders cover image when hasCover and albumId set', () => {
    const { container } = renderTrackInfo({ hasCover: true, albumId: 42 });
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThan(0);
    expect(imgs[0].getAttribute('src')).toBe('/api/covers/42');
  });

  it('renders fallback icon when no cover', () => {
    const { container } = renderTrackInfo({ hasCover: false });
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('links to album detail page', () => {
    renderTrackInfo({ albumId: 42 });
    const links = screen.getAllByRole('link');
    const albumLink = links.find((l) => l.getAttribute('href') === '/albums/42');
    expect(albumLink).toBeDefined();
  });

  it('links to # when no albumId', () => {
    renderTrackInfo({ albumId: undefined });
    const links = screen.getAllByRole('link');
    expect(links.every((l) => l.getAttribute('href') === '/' || l.getAttribute('href') === '#')).toBe(true);
  });

  it('has aria-hidden on vinyl disc animation', () => {
    const { container } = renderTrackInfo({ isPlaying: true });
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).not.toBeNull();
  });
});
