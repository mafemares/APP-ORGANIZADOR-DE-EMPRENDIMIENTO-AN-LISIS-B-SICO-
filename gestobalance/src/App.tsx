/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  DollarSign, 
  ArrowRightLeft,
  Wallet,
  Package,
  Truck,
  MoreHorizontal,
  Plus,
  Trash2
} from 'lucide-react';

type Category = 'Materiales' | 'Transporte' | 'Otros';

interface GastoItem {
  id: string;
  amount: number;
  category: Category;
}

export default function App() {
  const [ingresosInput, setIngresosInput] = useState<string>('');
  const [ingresoList, setIngresoList] = useState<{ id: string; amount: number }[]>(() => {
    const saved = localStorage.getItem('gb_ingresos');
    return saved ? JSON.parse(saved) : [];
  });
  const [gastoInput, setGastoInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Materiales');
  const [expenseList, setExpenseList] = useState<GastoItem[]>(() => {
    const saved = localStorage.getItem('gb_gastos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showResult, setShowResult] = useState(false);

  // Persistence side effect
  useEffect(() => {
    localStorage.setItem('gb_ingresos', JSON.stringify(ingresoList));
  }, [ingresoList]);

  useEffect(() => {
    localStorage.setItem('gb_gastos', JSON.stringify(expenseList));
  }, [expenseList]);
  const [result, setResult] = useState<{
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    profit: boolean;
    breakdown: Record<Category, number>;
  } | null>(null);

  const handleAddIngreso = () => {
    const amount = parseFloat(ingresosInput);
    if (isNaN(amount) || amount <= 0) return;

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      amount
    };

    setIngresoList(prev => [...prev, newItem]);
    setIngresosInput('');
  };

  const handleRemoveIngreso = (id: string) => {
    setIngresoList(prev => prev.filter(item => item.id !== id));
  };

  const handleAddGasto = () => {
    const amount = parseFloat(gastoInput);
    if (isNaN(amount) || amount <= 0) return;

    const newItem: GastoItem = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      category: selectedCategory
    };

    setExpenseList(prev => [...prev, newItem]);
    setGastoInput('');
  };

  const handleRemoveGasto = (id: string) => {
    setExpenseList(prev => prev.filter(item => item.id !== id));
  };

  const handleCalcular = () => {
    const totalI = ingresoList.reduce((acc, item) => acc + item.amount, 0);
    const totalG = expenseList.reduce((acc, item) => acc + item.amount, 0);
    const balance = totalI - totalG;
    
    const breakdown: Record<Category, number> = {
      'Materiales': 0,
      'Transporte': 0,
      'Otros': 0
    };

    expenseList.forEach(item => {
      breakdown[item.category] += item.amount;
    });
    
    setResult({
      totalIngresos: totalI,
      totalGastos: totalG,
      balance: balance,
      profit: balance >= 0,
      breakdown
    });
    setShowResult(true);
  };

  const handleReset = () => {
    setIngresosInput('');
    setIngresoList([]);
    setGastoInput('');
    setExpenseList([]);
    setShowResult(false);
    setResult(null);
  };

  const formatCurrency = (val: number) => {
    try {
      // Formato específico para Colombia: Puntos para miles, coma para decimales
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val);
    } catch (e) {
      // Fallback manual en caso de error de Intl
      const formatted = val.toFixed(2).replace('.', ',');
      return `$ ${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }
  };

  const categories = [
    { id: 'Materiales' as Category, icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Transporte' as Category, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Otros' as Category, icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="mb-8 text-center text-balance">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4"
          >
            <Wallet className="text-white w-6 h-6" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-4xl font-extrabold text-[#0F172A] tracking-tight"
          >
            GestoBalance <span className="text-blue-600">Pro</span>
          </motion.h1>
          <p className="text-[#64748B] text-sm mt-2 max-w-[280px] mx-auto leading-relaxed italic">
            El control financiero inteligente para tu emprendimiento.
          </p>
        </header>

        {/* Main Card */}
        <motion.div 
          layout
          className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8 overflow-hidden relative"
        >
          <div className="space-y-8">
            {/* Ingresos Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.15em] flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Registrar Ingresos
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    placeholder="Monto ingreso..."
                    value={ingresosInput}
                    onChange={(e) => setIngresosInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddIngreso()}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/30 border-2 border-transparent rounded-2xl focus:border-emerald-500/20 focus:bg-white transition-all text-lg font-bold outline-none shadow-sm"
                  />
                  {ingresosInput && !isNaN(parseFloat(ingresosInput)) && (
                    <div className="absolute -top-6 right-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <span className="text-[11px] font-black text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-lg shadow-emerald-200/50">
                        {formatCurrency(parseFloat(ingresosInput))}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddIngreso}
                  className="aspect-square bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-emerald-100 px-5"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* Income List */}
              <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {ingresoList.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm transition-all hover:border-emerald-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white text-emerald-500 shadow-sm">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-emerald-900 leading-none">{formatCurrency(item.amount)}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveIngreso(item.id)}
                        className="p-2 text-emerald-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {ingresoList.length === 0 && (
                  <div className="py-4 text-center border-2 border-dashed border-emerald-50 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Sin ingresos registrados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.15em] flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                Registro de Gastos
              </label>
              
              {/* Add Expense Form */}
              <div className="bg-slate-50/80 rounded-[1.5rem] p-4 space-y-4 border border-slate-100">
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`
                        flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300
                        ${selectedCategory === cat.id 
                          ? 'bg-white shadow-md shadow-slate-200 border-2 border-blue-100' 
                          : 'opacity-50 hover:opacity-100 bg-transparent grayscale border-2 border-transparent'}
                      `}
                    >
                      <cat.icon className={`w-5 h-5 ${cat.color}`} />
                      <span className="text-[10px] font-bold text-slate-600">{cat.id}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="Monto..."
                      value={gastoInput}
                      onChange={(e) => setGastoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGasto()}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-0 focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold outline-none shadow-sm"
                    />
                    {gastoInput && !isNaN(parseFloat(gastoInput)) && (
                      <div className="absolute -top-6 right-0 animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <span className="text-[10px] font-black text-white bg-blue-600 px-2.5 py-1 rounded-full shadow-lg shadow-blue-200/50">
                          {formatCurrency(parseFloat(gastoInput))}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddGasto}
                    className="aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center active:scale-95 shadow-lg shadow-blue-100 px-4"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expense List */}
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {expenseList.map((item) => {
                    const CatIcon = categories.find(c => c.id === item.category)?.icon || MoreHorizontal;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-slate-50 text-slate-500`}>
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{item.category}</p>
                            <p className="text-sm font-bold text-slate-700 leading-none">{formatCurrency(item.amount)}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveGasto(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {expenseList.length === 0 && (
                  <div className="py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sin gastos registrados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleCalcular}
                disabled={ingresoList.length === 0 && expenseList.length === 0}
                className="flex-[3] bg-[#0F172A] hover:bg-black disabled:opacity-50 disabled:pointer-events-none text-white font-bold py-5 rounded-[1.25rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Calculator className="w-6 h-6 text-blue-400" />
                Calcular Balance
              </button>
              {showResult && (
                <button
                  onClick={handleReset}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[1.25rem] flex items-center justify-center transition-colors active:scale-95 border border-rose-100"
                  title="Reiniciar todo"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-10 pt-10 border-t-2 border-slate-100"
              >
                <div className="space-y-6">
                  {/* Visual Results Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative p-5 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl border border-emerald-200 shadow-sm overflow-hidden"
                    >
                      <div className="absolute -right-2 -top-2 opacity-[0.08] pointer-events-none">
                        <TrendingUp className="w-20 h-20 text-emerald-900" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                            Ingresos
                          </p>
                        </div>
                        <p className="text-emerald-950 font-display font-bold text-2xl leading-tight">
                          {formatCurrency(result.totalIngresos)}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative p-5 bg-gradient-to-br from-rose-50 to-red-100 rounded-3xl border border-rose-200 shadow-sm overflow-hidden"
                    >
                      <div className="absolute -right-2 -top-2 opacity-[0.08] pointer-events-none">
                        <TrendingDown className="w-20 h-20 text-rose-900" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                            Gastos
                          </p>
                        </div>
                        <p className="text-rose-950 font-display font-bold text-2xl leading-tight">
                          {formatCurrency(result.totalGastos)}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Breakdown breakdown */}
                  <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Estructura de Gastos
                      </h3>
                      <p className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        {expenseList.length} Items
                      </p>
                    </div>
                    <div className="space-y-4">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                {cat.id}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-slate-800 tabular-nums">
                              {formatCurrency(result.breakdown[cat.id])}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  result.totalGastos > 0
                                    ? (result.breakdown[cat.id] /
                                        result.totalGastos) *
                                      100
                                    : 0
                                }%`,
                              }}
                              transition={{
                                type: "spring",
                                bounce: 0,
                                duration: 1,
                              }}
                              className={`h-full ${
                                cat.id === "Materiales"
                                  ? "bg-amber-400"
                                  : cat.id === "Transporte"
                                  ? "bg-blue-400"
                                  : "bg-slate-400 opacity-60"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Contrast Balance Card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-2 shadow-2xl transition-all duration-700 ${
                      result.profit
                        ? "bg-[#09090B] border-emerald-500/30 shadow-emerald-900/40"
                        : result.balance === 0
                        ? "bg-slate-100 border-slate-200 shadow-slate-200 text-slate-900"
                        : "bg-slate-900 border-slate-700 shadow-slate-300 text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-10">
                      <p
                        className={`text-[12px] font-black uppercase tracking-[0.25em] ${
                          result.profit || result.balance < 0
                            ? "text-white"
                            : "text-slate-600"
                        }`}
                      >
                        Rentabilidad Neta
                      </p>
                      <div
                        className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                          result.profit
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                            : result.balance === 0
                            ? "bg-white text-slate-600 border-slate-200"
                            : "bg-rose-500 text-white border-rose-400"
                        }`}
                      >
                        {result.balance === 0
                          ? "Equilibrio"
                          : result.profit
                          ? "Positivo"
                          : "Déficit"}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center space-y-2 mb-10 px-1">
                      <p
                        className={`font-display font-black text-xl sm:text-3xl md:text-5xl lg:text-7xl tracking-tighter transition-all duration-500 max-w-full break-all leading-none ${
                          result.profit || result.balance < 0
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {formatCurrency(result.balance)}
                      </p>
                      <p
                        className={`text-[12px] font-black uppercase tracking-[0.4em] px-1 ${
                          result.profit || result.balance < 0
                            ? "text-emerald-400"
                            : "text-slate-600"
                        }`}
                      >
                        Balance General
                      </p>
                    </div>

                    <div
                      className={`backdrop-blur-xl rounded-[2rem] p-6 border transition-all duration-500 ${
                        result.profit
                          ? "bg-zinc-800/30 border-white/5"
                          : result.balance === 0
                          ? "bg-white border-slate-100 shadow-slate-200/50"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      {(() => {
                        const margin = result.totalIngresos > 0 ? (result.balance / result.totalIngresos) : 0;
                        
                        // CASO: PÉRDIDA
                        if (result.balance < 0) {
                          return (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                  <TrendingDown className="w-5 h-5 text-rose-600" />
                                </div>
                                <div>
                                  <p className="font-black text-white text-[12px] uppercase tracking-[0.2em]">
                                    Ajuste Crítico Necesario
                                  </p>
                                  <div className="h-1 w-12 bg-rose-400 rounded-full mt-0.5" />
                                </div>
                              </div>
                              <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-400/30 backdrop-blur-md">
                                <p className="text-[13px] text-rose-50 font-medium leading-relaxed">
                                  <span className="font-bold text-white">¡Atención!</span> Tu negocio está gastando más de lo que ingresa. Te sugerimos <span className="text-rose-200 underline decoration-rose-400 decoration-2 underline-offset-4">revisar y reducir costos operativos</span> inmediatamente para proteger tu capital.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        // CASO: EQUILIBRIO
                        if (result.balance === 0) {
                          return (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                                  <ArrowRightLeft className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                  <p className="font-black text-slate-700 text-[12px] uppercase tracking-[0.2em]">
                                    Punto de Equilibrio
                                  </p>
                                  <div className="h-1 w-12 bg-slate-300 rounded-full mt-0.5" />
                                </div>
                              </div>
                              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
                                <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                  Estás cubriendo tus costos exactamente. Para crecer, necesitas <span className="font-bold text-slate-900 underline decoration-slate-300 decoration-2 underline-offset-4">optimizar procesos o ajustar precios</span>. No hay margen de error en este estado.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        // CASO: GANANCIA BAJA (Margen inferior al 15%)
                        if (margin < 0.15) {
                          return (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                  <Plus className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-black text-white text-[12px] uppercase tracking-[0.2em]">
                                    Margen de Mejora
                                  </p>
                                  <div className="h-1 w-12 bg-amber-400 rounded-full mt-0.5" />
                                </div>
                              </div>
                              <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-400/30 backdrop-blur-md">
                                <p className="text-[13px] text-amber-50 font-medium leading-relaxed">
                                  <span className="font-bold text-white">Ganancia moderada.</span> Tu margen de rentabilidad es del {Math.round(margin * 100)}%. Te sugerimos <span className="text-amber-200 underline decoration-amber-400 decoration-2 underline-offset-4">impulsar tus ventas</span> o buscar eficiencias para fortalecer tus utilidades.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        // CASO: GANANCIA ALTA
                        return (
                          <div className="animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400 blur-md opacity-40 animate-pulse" />
                                <div className="relative p-2 bg-white rounded-xl shadow-md">
                                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                              </div>
                              <div>
                                <p className="font-black text-white text-[13px] uppercase tracking-[0.2em] drop-shadow-md">
                                  ¡Excelente Desempeño!
                                </p>
                                <div className="h-1.5 w-16 bg-emerald-400 rounded-full mt-1 shadow-sm" />
                              </div>
                            </div>
                            
                            {/* Content Card with high contrast */}
                            <div className="p-7 bg-[#121214] rounded-[2rem] border border-emerald-500/20 shadow-inner">
                              <p className="text-[16px] text-white font-black leading-tight mb-5">
                                ¡Felicidades! Tienes una <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 shadow-sm">rentabilidad del {Math.round(margin * 100)}%</span>. 
                              </p>
                              <div className="h-px bg-white/5 mb-5" />
                              <p className="text-[14px] text-zinc-400 font-bold leading-relaxed">
                                Tu negocio está prosperando con éxito. Es un momento ideal para <span className="text-white italic font-black">reinvertir en expansión</span>, mejorar tu inventario o premiar tu esfuerzo personal.
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Brand Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.3em] mb-4">GestoBalance Framework v2</p>
          <div className="flex items-center justify-center gap-6 grayscale opacity-40">
             <div className="flex items-center gap-1.5">
               <div className="w-5 h-1.5 bg-blue-500 rounded-full" />
               <div className="w-2 h-1.5 bg-emerald-500 rounded-full" />
             </div>
             <p className="text-[10px] font-bold text-slate-500">Security Verified</p>
          </div>
        </footer>
      </div>
    </div>
  );
}


