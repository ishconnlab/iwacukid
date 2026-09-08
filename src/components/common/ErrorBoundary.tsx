import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function ErrorContent({ reset }: { reset: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">{t.error500Title}</h1>
        <p className="text-sm text-stone-500 leading-relaxed">{t.error500Desc}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-xs font-black transition-all cursor-pointer"
          >
            {t.tryAgainBtn}
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition-all inline-flex items-center gap-2 justify-center"
          >
            <Home className="w-4 h-4" />
            {t.backHomeBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Local mirror of the React class-component members we rely on.
// (This repo resolves `react` via allowJs inference, so the base class
// members are not statically typed.)
interface ErrorBoundaryMembers {
  state: State;
  props: Props;
  setState(next: Partial<State>): void;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    const self = this as unknown as ErrorBoundaryMembers;
    self.setState({ hasError: false });
  };

  render() {
    const self = this as unknown as ErrorBoundaryMembers;
    if (self.state.hasError) return <ErrorContent reset={this.handleReset} />;
    return self.props.children;
  }
}