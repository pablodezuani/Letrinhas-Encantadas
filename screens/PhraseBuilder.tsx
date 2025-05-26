import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as Speech from "expo-speech";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const categories = {
  Básicos: [
    { word: "Eu", image: null },
    { word: "Quero", image: null },
    { word: "Sim", image: null },
    { word: "Não", image: null },
  ],
  Acoes: [
    { word: "Comer", image: require("../assets/words/comer.png") },
    { word: "Beber", image: require("../assets/words/beber.png") },
    { word: "Dormir", image: require("../assets/words/dormir.png") },
    { word: "Brincar", image: require("../assets/words/brincar.png") },
    { word: "Correr", image: require("../assets/words/correr.png") },
    { word: "Pular", image: require("../assets/words/pular.png") },
    { word: "Andar", image: require("../assets/words/andar.png") },
    { word: "Cantar", image: require("../assets/words/cantar.png") },
    { word: "Desenhar", image: require("../assets/words/desenhar.png") },
    { word: "Abraçar", image: require("../assets/words/abracar.png") },
    { word: "Chorar", image: require("../assets/words/chorar.png") },
    { word: "Sorrir", image: require("../assets/words/sorrir.png") },
    { word: "Sentar", image: require("../assets/words/sentar.png") },
    { word: "Levantar", image: require("../assets/words/levantar.png") },
    { word: "Tomar banho", image: require("../assets/words/banho.png") },
  ],
  Sentimentos: [
    { word: "Feliz", image: require("../assets/words/feliz.png") },
    { word: "Triste", image: require("../assets/words/triste.png") },
    { word: "Bravo", image: require("../assets/words/bravo.png") },
    { word: "Com Medo", image: require("../assets/words/com_medo.png") },
    { word: "Cansado", image: require("../assets/words/cansado.png") },
    { word: "Animado", image: require("../assets/words/animado.png") },
    { word: "Assustado", image: require("../assets/words/assustado.png") },
    {
      word: "Envergonhado",
      image: require("../assets/words/envergonhado.png"),
    },
    { word: "Amado", image: require("../assets/words/amado.png") },
    { word: "Calmo", image: require("../assets/words/calmo.png") },
    { word: "Confuso", image: require("../assets/words/confuso.png") },
    { word: "Com ciúmes", image: require("../assets/words/ciumes.png") },
    { word: "Nervoso", image: require("../assets/words/nervoso.png") },
    { word: "Solitário", image: require("../assets/words/solitario.png") },
    { word: "Orgulhoso", image: require("../assets/words/orgulhoso.png") },
  ],
  Familia: [
    { word: "Mamãe", image: require("../assets/words/mamae.png") },
    { word: "Papai", image: require("../assets/words/papai.png") },
    { word: "Irmão", image: require("../assets/words/irmao.png") },
    { word: "Irmã", image: require("../assets/words/irma.png") },
    { word: "Vovó", image: require("../assets/words/vovo.png") },
    { word: "Vovô", image: require("../assets/words/vovo.png") },
    { word: "Tio", image: require("../assets/words/tio.png") },
    { word: "Tia", image: require("../assets/words/tia.png") },
    { word: "Primo", image: require("../assets/words/primo.png") },
    { word: "Prima", image: require("../assets/words/prima.png") },
  ],

  Higiene: [
    { word: "Escova de Dente", image: require("../assets/words/escova.png") },
    { word: "Pasta de Dente", image: require("../assets/words/pasta.png") },
    { word: "Sabonete", image: require("../assets/words/sabonete.png") },
    { word: "Shampoo", image: require("../assets/words/shampoo.png") },
    { word: "Toalha", image: require("../assets/words/toalha.png") },
    { word: "Pente", image: require("../assets/words/pente.png") },
    {
      word: "Papel Higiênico",
      image: require("../assets/words/papel_higienico.png"),
    },
    { word: "Banho", image: require("../assets/words/banho.png") },
    { word: "Vaso Sanitário", image: require("../assets/words/vaso.png") },
    { word: "Lenço", image: require("../assets/words/lenco.png") },
  ],
  TempoClima: [
    { word: "Sol", image: require("../assets/words/sol.png") },
    { word: "Chuva", image: require("../assets/words/chuva.png") },
    { word: "Nublado", image: require("../assets/words/nublado.png") },
    { word: "Frio", image: require("../assets/words/frio.png") },
    { word: "Calor", image: require("../assets/words/calor.png") },
    { word: "Vento", image: require("../assets/words/vento.png") },
    { word: "Arco-íris", image: require("../assets/words/arco_iris.png") },
    { word: "Relâmpago", image: require("../assets/words/relampago.png") },
    { word: "Neve", image: require("../assets/words/neve.png") },
    { word: "Tempestade", image: require("../assets/words/tempestade.png") },
  ],

  Comidas: [
    { word: "Arroz", image: require("../assets/words/arroz.png") },
    { word: "Feijão", image: require("../assets/words/feijao.png") },
    { word: "Pão", image: require("../assets/words/pao.png") },
    { word: "Leite", image: require("../assets/words/leite.png") },
    { word: "Suco", image: require("../assets/words/suco.png") },
    { word: "Biscoito", image: require("../assets/words/biscoito.png") },
    { word: "Iogurte", image: require("../assets/words/iogurte.png") },
    { word: "Sopa", image: require("../assets/words/sopa.png") },
    { word: "Ovo", image: require("../assets/words/ovo.png") },
    { word: "Macarrão", image: require("../assets/words/macarrao.png") },
  ],

  Dores: [
    { word: "Dor de Cabeça", image: require("../assets/words/dor_cabeca.png") },
    {
      word: "Dor de Barriga",
      image: require("../assets/words/dor_barriga.png"),
    },
    { word: "Dor de Dente", image: require("../assets/words/dente.png") },
    { word: "Dor no Braço", image: require("../assets/words/braco.png") },
    { word: "Dor na Perna", image: require("../assets/words/perna.png") },
    { word: "Dor no Pé", image: require("../assets/words/pe.png") },
    { word: "Dor no Ouvido", image: require("../assets/words/ouvido.png") },
    {
      word: "Dor nas Costas",
      image: require("../assets/words/dor_costas.png"),
    },
    {
      word: "Corte/Machucado",
      image: require("../assets/words/machucado.png"),
    },
    { word: "Febre", image: require("../assets/words/febre.png") },
    { word: "Tosse", image: require("../assets/words/tosse.png") },
    { word: "Enjoado", image: require("../assets/words/enjoado.png") },
    { word: "Coceira", image: require("../assets/words/coceira.png") },
    { word: "Espinho", image: require("../assets/words/espinho.png") },
    {
      word: "Picada de Inseto",
      image: require("../assets/words/picada_inseto.png"),
    },
  ],

  Frutas: [
    { word: "Maçã", image: require("../assets/words/maca.png") },
    { word: "Uva", image: require("../assets/words/uva.png") },
    { word: "Banana", image: require("../assets/words/banana.png") },
    { word: "Morango", image: require("../assets/words/morango.png") },
    { word: "Melancia", image: require("../assets/words/melancia.png") },
    { word: "Abacaxi", image: require("../assets/words/abacaxi.png") },
    { word: "Laranja", image: require("../assets/words/laranja.png") },
    { word: "Pera", image: require("../assets/words/pera.png") },
    { word: "Manga", image: require("../assets/words/manga.png") },
    { word: "Kiwi", image: require("../assets/words/kiwi.png") },
    { word: "Cereja", image: require("../assets/words/cereja.png") },
    { word: "Melão", image: require("../assets/words/melao.png") },
    { word: "Ameixa", image: require("../assets/words/ameixa.png") },
    { word: "Coco", image: require("../assets/words/coco.png") },
    { word: "Limão", image: require("../assets/words/limao.png") },
  ],

  Cores: [
    { word: "Vermelho", image: require("../assets/words/vermelho.png") },
    { word: "Azul", image: require("../assets/words/azul.png") },
    { word: "Amarelo", image: require("../assets/words/amarelo.png") },
    { word: "Verde", image: require("../assets/words/verde.png") },
    { word: "Roxo", image: require("../assets/words/roxo.png") },
    { word: "Laranja", image: require("../assets/words/laranja.png") },
    { word: "Rosa", image: require("../assets/words/rosa.png") },
    { word: "Marrom", image: require("../assets/words/marrom.png") },
    { word: "Cinza", image: require("../assets/words/cinza.png") },
    { word: "Preto", image: require("../assets/words/preto.png") },
    { word: "Branco", image: require("../assets/words/branco.png") },
    { word: "Bege", image: require("../assets/words/bege.png") },
    { word: "Dourado", image: require("../assets/words/dourado.png") },
    { word: "Prateado", image: require("../assets/words/prateado.png") },
  ],

  Animais: [
    { word: "Cachorro", image: require("../assets/words/cachorro.png") },
    { word: "Gato", image: require("../assets/words/gato.png") },
    { word: "Pássaro", image: require("../assets/words/passaro.png") },
    { word: "Pato", image: require("../assets/words/pato.png") },
    { word: "Cavalo", image: require("../assets/words/cavalo.png") },
    { word: "Vaca", image: require("../assets/words/vaca.png") },
    { word: "Porco", image: require("../assets/words/porco.png") },
    { word: "Galinha", image: require("../assets/words/galinha.png") },
    { word: "Leão", image: require("../assets/words/leao.png") },
    { word: "Elefante", image: require("../assets/words/elefante.png") },
    { word: "Macaco", image: require("../assets/words/macaco.png") },
    { word: "Girafa", image: require("../assets/words/girafa.png") },
    { word: "Peixe", image: require("../assets/words/peixe.png") },
    { word: "Coelho", image: require("../assets/words/coelho.png") },
    { word: "Urso", image: require("../assets/words/urso.png") },
    { word: "Jacaré", image: require("../assets/words/jacare.png") },
    { word: "Tigre", image: require("../assets/words/tigre.png") },
    { word: "Zebra", image: require("../assets/words/zebra.png") },
    { word: "Tartaruga", image: require("../assets/words/tartaruga.png") },
    { word: "Cobra", image: require("../assets/words/cobra.png") },
  ],

  Roupas: [
    { word: "Camiseta", image: require("../assets/words/camiseta.png") },
    { word: "Calça", image: require("../assets/words/calca.png") },
    { word: "Vestido", image: require("../assets/words/vestido.png") },
    { word: "Saia", image: require("../assets/words/saia.png") },
    { word: "Shorts", image: require("../assets/words/shorts.png") },
    { word: "Tênis", image: require("../assets/words/tenis.png") },
    { word: "Chinelo", image: require("../assets/words/chinelo.png") },
    { word: "Sandália", image: require("../assets/words/sandalia.png") },
    { word: "Boné", image: require("../assets/words/bone.png") },
    { word: "Casaco", image: require("../assets/words/casaco.png") },
    { word: "Meias", image: require("../assets/words/meias.png") },
    { word: "Pijama", image: require("../assets/words/pijama.png") },
  ],
  Lugares: [
    { word: "Escola", image: require("../assets/words/escola.png") },
    { word: "Parque", image: require("../assets/words/parque.png") },
    { word: "Praia", image: require("../assets/words/praia.png") },
    { word: "Casa", image: require("../assets/words/casa.png") },
    { word: "Cozinha", image: require("../assets/words/cozinha.png") },
    { word: "Banheiro", image: require("../assets/words/banheiro.png") },
    { word: "Quarto", image: require("../assets/words/quarto.png") },
    { word: "Sala", image: require("../assets/words/sala.png") },
    {
      word: "Supermercado",
      image: require("../assets/words/supermercado.png"),
    },
    { word: "Hospital", image: require("../assets/words/hospital.png") },
    { word: "Igreja", image: require("../assets/words/igreja.png") },
    { word: "Zoológico", image: require("../assets/words/zoologico.png") },
  ],
  Brinquedos: [
    { word: "Bola", image: require("../assets/words/bola.png") },
    { word: "Boneca", image: require("../assets/words/boneca.png") },
    { word: "Carrinho", image: require("../assets/words/carrinho.png") },
    {
      word: "Quebra-cabeça",
      image: require("../assets/words/quebra_cabeca.png"),
    },
    { word: "Blocos", image: require("../assets/words/blocos.png") },
    { word: "Pelúcia", image: require("../assets/words/pelucia.png") },
    { word: "Patinete", image: require("../assets/words/patinete.png") },
    { word: "Bicicleta", image: require("../assets/words/bicicleta.png") },
    { word: "Lego", image: require("../assets/words/lego.png") },
    { word: "Massinha", image: require("../assets/words/massinha.png") },
    { word: "Ioiô", image: require("../assets/words/ioio.png") },
    { word: "Pião", image: require("../assets/words/piao.png") },
  ],

  Alfabeto: alphabet.map((l) => ({ word: l, image: null })),
  Números: numbers.map((n) => ({ word: n, image: null })),
};

export default function PhraseBuilder({ route, navigation }) {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof categories>("Básicos");
  const [phrase, setPhrase] = useState<string[]>([]);
  const { gender } = route.params;

  const speakWord = (word: string) => {
    Speech.speak(word, { language: "pt-BR" });
  };

  const handleWordPress = (word: string) => {
    speakWord(word);
    setPhrase((prev) => [...prev, word]);
  };

  const handleSpeakPhrase = () => {
    if (phrase.length > 0) {
      Speech.speak(phrase.join(" "), { language: "pt-BR" });
    }
  };

  const handleDeleteLast = () => {
    setPhrase((prev) => prev.slice(0, prev.length - 1));
  };

  const backgroundColor = gender === "menino" ? "#A1C6F1" : "#F7B7C5";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Monte sua frase 💬</Text>

      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {Object.keys(categories).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.activeCategory,
              ]}
              onPress={() =>
                setSelectedCategory(cat as keyof typeof categories)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PALAVRAS */}
      <ScrollView contentContainerStyle={styles.wordsContainer}>
        {categories[selectedCategory].map(({ word, image }) => (
          <TouchableOpacity
            key={word}
            style={styles.wordButton}
            onPress={() => handleWordPress(word)}
          >
            {image ? (
              <Image source={image} style={styles.wordImage} />
            ) : (
              <View style={styles.emptyImage} />
            )}
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FRASE MONTADA */}
      <View style={styles.phraseContainer}>
        <Text style={styles.phraseLabel}>Frase:</Text>
        <Text style={styles.phraseText}>{phrase.join(" ") || "---"}</Text>
      </View>

      {/* BOTÕES */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handleSpeakPhrase}>
          <Text style={styles.playButtonText}>🔊 Falar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteLast}
          disabled={phrase.length === 0}
        >
          <Text style={styles.deleteButtonText}>⌫ Apagar Última</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1C6F1",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#3A3897",
    marginTop: 30,
    marginBottom: 10,
  },
  categoryWrapper: {
    height: 50,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 5,
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#ECECFF",
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: "#FFD700",
  },
  categoryText: {
    fontSize: 15,
    color: "#3A3897",
  },
  activeCategoryText: {
    fontWeight: "bold",
    color: "#fff",
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  wordButton: {
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 6,
    margin: 6,
    borderRadius: 16,
    width: screenWidth / 4.5, // diminuiu um pouco (antes era 3.2)
    elevation: 2,
  },
  wordImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 5,
  },
  emptyImage: {
    height: 50,
    marginBottom: 5,
  },
  wordText: {
    fontSize: 14,
    color: "#3A3897",
    textAlign: "center",
  },
  phraseContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0FF",
    minHeight: 60,
    marginBottom: 20,
  },
  phraseLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#3A3897",
    marginBottom: 5,
  },
  phraseText: {
    fontSize: 18,
    color: "#FF6347",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // espaço máximo entre os botões
    marginBottom: 30,
    paddingHorizontal: 20, // um pouco de margem nas laterais
  },

  playButton: {
    flex: 1, // cada botão ocupa espaço igual
    backgroundColor: "#6A5ACD",
    paddingVertical: 14,
    borderRadius: 20,
    marginRight: 10, // espaçamento entre botões
    alignItems: "center",
  },
  playButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#D9534F",
    paddingVertical: 14,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FFA500",
    paddingVertical: 14,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
